from django.contrib.auth import get_user_model
from django.db import transaction

from apps.memberships.models import ProjectMembership
from apps.projects.models import Project
from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task, TaskStatus

from .policies import can_create_task


class TaskProjectNotFoundError(Exception):
    pass


class TaskCreatePermissionDeniedError(Exception):
    pass


class InvalidTaskDateRangeError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task date range.")
        self.details = details


class InvalidTaskAssigneeError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid task assignee.")
        self.details = details


def get_project_for_actor(*, actor, project_id):
    project = visible_projects_for_user(user=actor).filter(id=project_id).first()
    if project is None:
        raise TaskProjectNotFoundError

    return project


def list_tasks_for_actor(*, actor, project_id):
    project = get_project_for_actor(actor=actor, project_id=project_id)
    tasks = (
        Task.objects.filter(project=project)
        .select_related("primary_assignee")
        .order_by("task_number")
    )
    return project, list(tasks)


@transaction.atomic
def create_task(
    *,
    actor,
    project_id,
    title: str,
    description: str | None = None,
    start_date=None,
    deadline=None,
    primary_assignee_id=None,
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

    if start_date and deadline and deadline < start_date:
        raise InvalidTaskDateRangeError(
            {"deadline": ["Deadline cannot be earlier than start date."]}
        )

    primary_assignee = None
    if primary_assignee_id is not None:
        user_model = get_user_model()
        primary_assignee = user_model.objects.filter(id=primary_assignee_id).first()
        if primary_assignee is None or not primary_assignee.is_active:
            raise InvalidTaskAssigneeError(
                {"primary_assignee_id": ["The assignee must be an active project member."]}
            )

        is_active_member = ProjectMembership.objects.filter(
            project=project,
            user=primary_assignee,
            deleted_at__isnull=True,
        ).exists()
        if not is_active_member:
            raise InvalidTaskAssigneeError(
                {"primary_assignee_id": ["The assignee must be an active project member."]}
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
        status=TaskStatus.TODO,
        primary_assignee=primary_assignee,
        created_by=actor,
        start_date=start_date,
        deadline=deadline,
    )
    return task
