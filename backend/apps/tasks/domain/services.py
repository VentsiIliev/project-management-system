import time

from django.contrib.auth import get_user_model
from django.db import OperationalError, transaction
from django.utils import timezone

from apps.activity_logs.models import ActivityLogEvent
from apps.activity_logs.services import record_activity
from apps.memberships.models import ProjectMembership
from apps.notifications.services import create_task_notifications
from apps.projects.models import Project
from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import (
    Task,
    TaskDependency,
    TaskPriority,
    TaskStatusName,
    TaskStatusTransition,
    TaskWorkflowStatus,
)
from apps.tasks.selectors import list_my_tasks_for_user, list_project_tasks_for_user, visible_tasks_for_user

from .policies import (
    can_change_task_status,
    can_create_task,
    can_delete_task,
    can_manage_task_dependencies,
    can_update_task_description,
    can_update_task_planning,
)


UNSET = object()


class TaskProjectNotFoundError(Exception):
    pass


class TaskNotFoundError(Exception):
    pass


class TaskCreatePermissionDeniedError(Exception):
    pass


class TaskDeletePermissionDeniedError(Exception):
    pass


class TaskUpdatePermissionDeniedError(Exception):
    pass


class TaskStatusChangePermissionDeniedError(Exception):
    pass


class InvalidTaskDateRangeError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task date range.")
        self.details = details


class InvalidTaskAssigneeError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task assignee.")
        self.details = details


class InvalidTaskPriorityError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task priority.")
        self.details = details


class InvalidTaskCollaboratorError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task collaborators.")
        self.details = details


class InvalidTaskParentError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid parent task.")
        self.details = details


class TaskOptimisticLockError(Exception):
    def __init__(self, *, current_version: int):
        super().__init__("Task was modified by another user. Please refresh and try again.")
        self.current_version = current_version


class InvalidTaskStatusTransitionError(Exception):
    pass


class InvalidTaskHierarchyError(Exception):
    pass


class TaskCascadeConfirmationRequiredError(Exception):
    pass


class SubtasksIncompleteError(Exception):
    pass


class TaskBlockedError(Exception):
    pass


class TaskDependencyPermissionDeniedError(Exception):
    pass


class InvalidTaskDependencyError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task dependency.")
        self.details = details


class DuplicateTaskDependencyError(Exception):
    pass


class CrossProjectTaskDependencyError(Exception):
    pass


class TaskDependencyCycleError(Exception):
    pass


class TaskDependencyNotFoundError(Exception):
    pass


def get_project_for_actor(*, actor, project_id):
    project = visible_projects_for_user(user=actor).filter(id=project_id).first()
    if project is None:
        raise TaskProjectNotFoundError

    return project


def list_tasks_for_actor(
    *,
    actor,
    project_id,
    search: str | None = None,
    status_id=None,
    priority_id=None,
    assignee_id=None,
    deadline_from=None,
    deadline_to=None,
    is_blocked: bool | None = None,
    page: int = 1,
    page_size: int = 10,
):
    project = get_project_for_actor(actor=actor, project_id=project_id)
    tasks, pagination = list_project_tasks_for_user(
        user=actor,
        project_id=project.id,
        search=search,
        status_id=status_id,
        priority_id=priority_id,
        assignee_id=assignee_id,
        deadline_from=deadline_from,
        deadline_to=deadline_to,
        is_blocked=is_blocked,
        page=page,
        page_size=page_size,
    )
    return project, tasks, pagination


def list_my_tasks_for_actor(
    *,
    actor,
    include_collaborator_tasks: bool,
    sort_by: str,
    page: int = 1,
    page_size: int = 10,
):
    return list_my_tasks_for_user(
        user=actor,
        include_collaborator_tasks=include_collaborator_tasks,
        sort_by=sort_by,
        page=page,
        page_size=page_size,
    )


def get_task_for_actor(*, actor, task_id):
    task = visible_tasks_for_user(user=actor).filter(id=task_id).first()
    if task is None:
        raise TaskNotFoundError

    return task


def get_default_task_status() -> TaskWorkflowStatus:
    status = TaskWorkflowStatus.objects.filter(name=TaskStatusName.TODO).first()
    if status is None:
        raise RuntimeError("Default TODO task status is not configured.")

    return status


def get_in_progress_task_status() -> TaskWorkflowStatus:
    status = TaskWorkflowStatus.objects.filter(name=TaskStatusName.IN_PROGRESS).first()
    if status is None:
        raise RuntimeError("Default IN_PROGRESS task status is not configured.")

    return status


def is_task_overdue(task: Task) -> bool:
    if task.deadline is None or task.status.is_final:
        return False

    return task.deadline < timezone.localdate()


def is_task_blocked(task: Task) -> bool:
    dependency_links = getattr(task, "_prefetched_objects_cache", {}).get("dependency_links")
    if dependency_links is not None:
        return any(not link.depends_on_task.status.is_final for link in dependency_links)

    return TaskDependency.objects.filter(
        task=task,
        depends_on_task__deleted_at__isnull=True,
        depends_on_task__status__is_final=False,
    ).exists()


def _validate_active_project_member(*, project, user_id, field_name: str):
    user_model = get_user_model()
    member = user_model.objects.filter(id=user_id).first()
    if member is None or not member.is_active:
        raise InvalidTaskAssigneeError(
            {field_name: ["The assignee must be an active project member."]}
        )

    is_active_member = ProjectMembership.objects.filter(
        project=project,
        user=member,
        deleted_at__isnull=True,
    ).exists()
    if not is_active_member:
        raise InvalidTaskAssigneeError(
            {field_name: ["The assignee must be an active project member."]}
        )

    return member


def _validate_task_date_range(*, start_date, deadline):
    if start_date and deadline and deadline < start_date:
        raise InvalidTaskDateRangeError(
            {"deadline": ["Deadline cannot be earlier than start date."]}
        )


def _validate_task_priority(*, priority_id):
    if priority_id is None:
        return None

    priority = TaskPriority.objects.filter(id=priority_id).first()
    if priority is None:
        raise InvalidTaskPriorityError(
            {"priority_id": ["The selected priority does not exist."]}
        )
    if not priority.is_active:
        raise InvalidTaskPriorityError(
            {"priority_id": ["Inactive priorities cannot be assigned to new tasks."]}
        )

    return priority


def _validate_collaborators(*, project, collaborator_ids, primary_assignee):
    unique_ids = list(dict.fromkeys(collaborator_ids))
    if primary_assignee is not None and str(primary_assignee.id) in {
        str(collaborator_id) for collaborator_id in unique_ids
    }:
        raise InvalidTaskCollaboratorError(
            {
                "collaborator_ids": [
                    "The primary assignee cannot also be listed as a collaborator."
                ]
            }
        )

    user_model = get_user_model()
    collaborators = list(user_model.objects.filter(id__in=unique_ids))
    collaborators_by_id = {str(user.id): user for user in collaborators}
    if len(collaborators_by_id) != len(unique_ids):
        raise InvalidTaskCollaboratorError(
            {
                "collaborator_ids": [
                    "Collaborators must be active project members."
                ]
            }
        )

    membership_ids = {
        str(user_id)
        for user_id in ProjectMembership.objects.filter(
            project=project,
            deleted_at__isnull=True,
            user_id__in=unique_ids,
            user__is_active=True,
        ).values_list("user_id", flat=True)
    }
    if membership_ids != {str(collaborator_id) for collaborator_id in unique_ids}:
        raise InvalidTaskCollaboratorError(
            {
                "collaborator_ids": [
                    "Collaborators must be active project members."
                ]
            }
        )

    return [collaborators_by_id[str(collaborator_id)] for collaborator_id in unique_ids]


def _validate_parent_task(*, actor, project, parent_task_id):
    if parent_task_id is None:
        return None

    parent_task = (
        visible_tasks_for_user(user=actor, project_id=project.id)
        .filter(id=parent_task_id)
        .first()
    )
    if parent_task is None:
        raise InvalidTaskParentError(
            {"parent_task_id": ["The parent task must belong to the same active project."]}
        )

    if parent_task.parent_task_id is not None:
        raise InvalidTaskHierarchyError

    return parent_task


def _dependency_edge_queryset():
    return TaskDependency.objects.filter(depends_on_task__deleted_at__isnull=True).select_related(
        "depends_on_task",
        "depends_on_task__status",
        "depends_on_task__priority",
        "depends_on_task__primary_assignee",
    )


def _active_subtasks(*, task, for_update: bool = False):
    queryset = Task.objects.filter(parent_task=task).select_related("status")
    if for_update:
        queryset = queryset.select_for_update()
    return list(queryset.order_by("task_number"))


def _validate_dependency_target(*, project, depends_on_task_id):
    if depends_on_task_id is None:
        raise InvalidTaskDependencyError(
            {"depends_on_task_id": ["A dependency task id is required."]}
        )

    depends_on_task = Task.all_objects.select_related("project").filter(id=depends_on_task_id).first()
    if depends_on_task is None or depends_on_task.deleted_at is not None:
        raise InvalidTaskDependencyError(
            {"depends_on_task_id": ["The dependency task must be an active task."]}
        )

    if depends_on_task.project_id != project.id:
        raise CrossProjectTaskDependencyError

    return depends_on_task


def _assert_no_dependency_cycle(*, project, task_id, depends_on_task_id):
    edges = list(
        TaskDependency.objects.filter(
            task__project=project,
            task__deleted_at__isnull=True,
            depends_on_task__deleted_at__isnull=True,
        ).values_list("task_id", "depends_on_task_id")
    )
    adjacency: dict[str, set[str]] = {}
    for from_task_id, to_task_id in edges:
        adjacency.setdefault(str(from_task_id), set()).add(str(to_task_id))
    adjacency.setdefault(str(task_id), set()).add(str(depends_on_task_id))

    target = str(depends_on_task_id)
    goal = str(task_id)
    stack = [target]
    visited: set[str] = set()
    while stack:
        current = stack.pop()
        if current == goal:
            raise TaskDependencyCycleError
        if current in visited:
            continue
        visited.add(current)
        stack.extend(adjacency.get(current, set()) - visited)


def list_task_dependencies(*, actor, task_id):
    task = get_task_for_actor(actor=actor, task_id=task_id)
    links = list(_dependency_edge_queryset().filter(task=task).order_by("depends_on_task__task_number"))
    return [link.depends_on_task for link in links]


@transaction.atomic
def _create_task_once(
    *,
    actor,
    project_id,
    title: str,
    description: str | None = None,
    priority_id=None,
    start_date=None,
    deadline=None,
    primary_assignee_id=None,
    collaborator_ids=None,
    parent_task_id=None,
):
    project = (
        Project.objects.select_for_update()
        .filter(id=project_id)
        .first()
    )
    if project is None:
        raise TaskProjectNotFoundError

    if not visible_projects_for_user(user=actor).filter(id=project_id).exists():
        raise TaskProjectNotFoundError

    if not can_create_task(user=actor, project=project):
        raise TaskCreatePermissionDeniedError

    _validate_task_date_range(start_date=start_date, deadline=deadline)

    priority = _validate_task_priority(priority_id=priority_id)
    parent_task = _validate_parent_task(
        actor=actor,
        project=project,
        parent_task_id=parent_task_id,
    )
    primary_assignee = None
    if primary_assignee_id is not None:
        primary_assignee = _validate_active_project_member(
            project=project,
            user_id=primary_assignee_id,
            field_name="primary_assignee_id",
        )
    collaborators = _validate_collaborators(
        project=project,
        collaborator_ids=collaborator_ids or [],
        primary_assignee=primary_assignee,
    )

    next_task_number = project.task_counter + 1
    project.task_counter = next_task_number
    project.save(update_fields=["task_counter", "updated_at"])

    task = Task.all_objects.create(
        project=project,
        task_number=next_task_number,
        task_key=f"{project.code}-{next_task_number}",
        title=title,
        description=description or None,
        status=get_default_task_status(),
        priority=priority,
        primary_assignee=primary_assignee,
        parent_task=parent_task,
        created_by=actor,
        start_date=start_date,
        deadline=deadline,
    )
    if collaborators:
        task.collaborators.set(collaborators)

    record_activity(
        event_type=ActivityLogEvent.SUBTASK_CREATED if parent_task is not None else ActivityLogEvent.TASK_CREATED,
        actor=actor,
        project=project,
        task=task,
        metadata={"parent_task_key": getattr(parent_task, "task_key", None)},
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.SUBTASK_CREATED if parent_task is not None else ActivityLogEvent.TASK_CREATED,
        metadata={"parent_task_key": getattr(parent_task, "task_key", None)},
    )

    return task


def create_task(
    *,
    actor,
    project_id,
    title: str,
    description: str | None = None,
    priority_id=None,
    start_date=None,
    deadline=None,
    primary_assignee_id=None,
    collaborator_ids=None,
    parent_task_id=None,
):
    for attempt in range(3):
        try:
            return _create_task_once(
                actor=actor,
                project_id=project_id,
                title=title,
                description=description,
                priority_id=priority_id,
                start_date=start_date,
                deadline=deadline,
                primary_assignee_id=primary_assignee_id,
                collaborator_ids=collaborator_ids,
                parent_task_id=parent_task_id,
            )
        except OperationalError as exc:
            if "locked" not in str(exc).lower() or attempt == 2:
                raise

            time.sleep(0.05)


@transaction.atomic
def delete_task(*, actor, task_id, confirm_cascade_subtasks: bool = False):
    task = (
        Task.objects.select_for_update()
        .select_related("project")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    if not can_delete_task(user=actor, project=task.project):
        raise TaskDeletePermissionDeniedError

    active_subtasks = list(
        Task.objects.select_for_update()
        .filter(parent_task=task)
        .order_by("task_number")
    )
    if active_subtasks and not confirm_cascade_subtasks:
        raise TaskCascadeConfirmationRequiredError

    for subtask in active_subtasks:
        record_activity(
            event_type=ActivityLogEvent.SUBTASK_DELETED,
            actor=actor,
            project=task.project,
            task=subtask,
        )
    record_activity(
        event_type=ActivityLogEvent.TASK_DELETED,
        actor=actor,
        project=task.project,
        task=task,
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.TASK_DELETED,
    )

    deleted_at = timezone.now()
    Task.all_objects.filter(id__in=[task.id, *[subtask.id for subtask in active_subtasks]]).update(
        deleted_at=deleted_at,
        updated_at=deleted_at,
    )

    TaskDependency.objects.filter(task_id__in=[task.id, *[subtask.id for subtask in active_subtasks]]).delete()
    TaskDependency.objects.filter(
        depends_on_task_id__in=[task.id, *[subtask.id for subtask in active_subtasks]]
    ).delete()


@transaction.atomic
def update_task(
    *,
    actor,
    task_id,
    version: int,
    title=UNSET,
    description=UNSET,
    priority_id=UNSET,
    start_date=UNSET,
    deadline=UNSET,
    primary_assignee_id=UNSET,
    collaborator_ids=UNSET,
):
    task = (
        Task.objects.select_for_update()
        .select_related("project", "primary_assignee", "priority", "status", "parent_task")
        .prefetch_related("collaborators", "subtasks__collaborators")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    if task.version != version:
        raise TaskOptimisticLockError(current_version=task.version)

    requested_fields = set()
    for field_name, field_value in {
        "title": title,
        "description": description,
        "priority_id": priority_id,
        "start_date": start_date,
        "deadline": deadline,
        "primary_assignee_id": primary_assignee_id,
        "collaborator_ids": collaborator_ids,
    }.items():
        if field_value is not UNSET:
            requested_fields.add(field_name)

    planning_fields = {
        "title",
        "priority_id",
        "start_date",
        "deadline",
        "primary_assignee_id",
        "collaborator_ids",
    }
    description_only = requested_fields <= {"description"}
    includes_planning_fields = bool(requested_fields & planning_fields)

    if includes_planning_fields and not can_update_task_planning(user=actor, project=task.project):
        raise TaskUpdatePermissionDeniedError
    if description_only and not can_update_task_description(user=actor, project=task.project):
        raise TaskUpdatePermissionDeniedError

    next_start_date = task.start_date if start_date is UNSET else start_date
    next_deadline = task.deadline if deadline is UNSET else deadline
    _validate_task_date_range(start_date=next_start_date, deadline=next_deadline)

    previous_assignee_id = task.primary_assignee_id
    next_priority = task.priority
    if priority_id is not UNSET:
        next_priority = _validate_task_priority(priority_id=priority_id)

    next_primary_assignee = task.primary_assignee
    if primary_assignee_id is not UNSET:
        if primary_assignee_id is None:
            next_primary_assignee = None
        else:
            next_primary_assignee = _validate_active_project_member(
                project=task.project,
                user_id=primary_assignee_id,
                field_name="primary_assignee_id",
            )

    next_collaborators = None
    if collaborator_ids is not UNSET:
        next_collaborators = _validate_collaborators(
            project=task.project,
            collaborator_ids=collaborator_ids,
            primary_assignee=next_primary_assignee,
        )

    updated_fields = {"version", "updated_at"}
    if title is not UNSET:
        task.title = title
        updated_fields.add("title")
    if description is not UNSET:
        task.description = description or None
        updated_fields.add("description")
    if priority_id is not UNSET:
        task.priority = next_priority
        updated_fields.add("priority")
    if start_date is not UNSET:
        task.start_date = start_date
        updated_fields.add("start_date")
    if deadline is not UNSET:
        task.deadline = deadline
        updated_fields.add("deadline")
    if primary_assignee_id is not UNSET:
        task.primary_assignee = next_primary_assignee
        updated_fields.add("primary_assignee")

    task.version += 1
    task.save(update_fields=sorted(updated_fields))

    if next_collaborators is not None:
        task.collaborators.set(next_collaborators)

    record_activity(
        event_type=ActivityLogEvent.TASK_UPDATED,
        actor=actor,
        project=task.project,
        task=task,
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.TASK_UPDATED,
    )
    if primary_assignee_id is not UNSET and previous_assignee_id != task.primary_assignee_id:
        record_activity(
            event_type=ActivityLogEvent.TASK_ASSIGNED,
            actor=actor,
            project=task.project,
            task=task,
            related_user=task.primary_assignee,
        )

    return visible_tasks_for_user(user=actor).get(id=task.id)


@transaction.atomic
def _add_task_dependency_once(*, actor, task_id, depends_on_task_id):
    task = (
        Task.objects.select_for_update()
        .select_related("project")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    if not can_manage_task_dependencies(user=actor, project=task.project):
        raise TaskDependencyPermissionDeniedError

    if str(task.id) == str(depends_on_task_id):
        raise InvalidTaskDependencyError(
            {"depends_on_task_id": ["A task cannot depend on itself."]}
        )

    depends_on_task = _validate_dependency_target(project=task.project, depends_on_task_id=depends_on_task_id)

    list(Task.objects.select_for_update().filter(project=task.project).values_list("id", flat=True))

    if TaskDependency.objects.filter(task=task, depends_on_task=depends_on_task).exists():
        raise DuplicateTaskDependencyError

    _assert_no_dependency_cycle(
        project=task.project,
        task_id=task.id,
        depends_on_task_id=depends_on_task.id,
    )

    TaskDependency.objects.create(task=task, depends_on_task=depends_on_task)
    record_activity(
        event_type=ActivityLogEvent.DEPENDENCY_ADDED,
        actor=actor,
        project=task.project,
        task=task,
        metadata={"depends_on_task_key": depends_on_task.task_key},
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.DEPENDENCY_ADDED,
        metadata={"depends_on_task_key": depends_on_task.task_key},
    )
    return visible_tasks_for_user(user=actor).get(id=task.id)


def add_task_dependency(*, actor, task_id, depends_on_task_id):
    for attempt in range(3):
        try:
            return _add_task_dependency_once(
                actor=actor,
                task_id=task_id,
                depends_on_task_id=depends_on_task_id,
            )
        except OperationalError as exc:
            if "locked" not in str(exc).lower() or attempt == 2:
                raise

            time.sleep(0.05)


@transaction.atomic
def remove_task_dependency(*, actor, task_id, depends_on_task_id):
    task = (
        Task.objects.select_for_update()
        .select_related("project")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    if not can_manage_task_dependencies(user=actor, project=task.project):
        raise TaskDependencyPermissionDeniedError

    dependency = (
        TaskDependency.objects.select_for_update()
        .filter(task=task, depends_on_task_id=depends_on_task_id)
        .first()
    )
    if dependency is None:
        raise TaskDependencyNotFoundError

    depends_on_task = dependency.depends_on_task
    dependency.delete()
    record_activity(
        event_type=ActivityLogEvent.DEPENDENCY_REMOVED,
        actor=actor,
        project=task.project,
        task=task,
        metadata={"depends_on_task_key": depends_on_task.task_key},
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.DEPENDENCY_REMOVED,
        metadata={"depends_on_task_key": depends_on_task.task_key},
    )
    return visible_tasks_for_user(user=actor).get(id=task.id)


@transaction.atomic
def change_task_status(
    *,
    actor,
    task_id,
    to_status_id,
    version: int,
):
    task = (
        Task.objects.select_for_update()
        .select_related("project", "primary_assignee", "priority", "status", "parent_task")
        .prefetch_related("collaborators", "subtasks__collaborators")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    if not can_change_task_status(user=actor, project=task.project):
        raise TaskStatusChangePermissionDeniedError

    if task.version != version:
        raise TaskOptimisticLockError(current_version=task.version)

    to_status = TaskWorkflowStatus.objects.filter(id=to_status_id, is_active=True).first()
    if to_status is None:
        raise InvalidTaskStatusTransitionError

    transition_exists = TaskStatusTransition.objects.filter(
        from_status=task.status,
        to_status=to_status,
        is_active=True,
    ).exists()
    if not transition_exists:
        raise InvalidTaskStatusTransitionError

    if task.parent_task_id is None and to_status.is_final:
        if any(not subtask.status.is_final for subtask in _active_subtasks(task=task, for_update=True)):
            raise SubtasksIncompleteError

    if to_status.name in {TaskStatusName.IN_PROGRESS, TaskStatusName.DONE} and is_task_blocked(task):
        raise TaskBlockedError

    if task.parent_task_id is not None and task.status.is_final and not to_status.is_final:
        parent_task = (
            Task.objects.select_for_update()
            .select_related("status")
            .filter(id=task.parent_task_id, deleted_at__isnull=True)
            .first()
        )
        if parent_task is not None and parent_task.status.is_final:
            parent_task.status = get_in_progress_task_status()
            parent_task.version += 1
            parent_task.save(update_fields=["status", "version", "updated_at"])
            record_activity(
                event_type=ActivityLogEvent.PARENT_REOPENED,
                actor=None,
                project=parent_task.project,
                task=parent_task,
                metadata={"trigger_task_key": task.task_key},
            )

    from_status_name = task.status.name
    task.status = to_status
    task.version += 1
    task.save(update_fields=["status", "version", "updated_at"])
    record_activity(
        event_type=ActivityLogEvent.TASK_STATUS_CHANGED,
        actor=actor,
        project=task.project,
        task=task,
        metadata={"from_status": from_status_name, "to_status": to_status.name},
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.TASK_STATUS_CHANGED,
        metadata={"from_status": from_status_name, "to_status": to_status.name},
    )

    return visible_tasks_for_user(user=actor).get(id=task.id)
