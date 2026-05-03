from math import ceil

from django.db.models import Exists, F, OuterRef, Prefetch, Q

from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task, TaskDependency, TaskPriority, TaskStatusTransition, TaskWorkflowStatus


def _subtask_prefetch():
    return Prefetch(
        "subtasks",
        queryset=Task.objects.select_related("primary_assignee", "priority", "status")
        .prefetch_related("collaborators", _dependency_prefetch())
        .order_by("task_number"),
    )


def _dependency_prefetch():
    return Prefetch(
        "dependency_links",
        queryset=TaskDependency.objects.filter(depends_on_task__deleted_at__isnull=True)
        .select_related(
            "depends_on_task",
            "depends_on_task__primary_assignee",
            "depends_on_task__priority",
            "depends_on_task__status",
        )
        .order_by("depends_on_task__task_number"),
    )


def visible_tasks_for_user(*, user, project_id=None):
    queryset = Task.objects.filter(
        project__in=visible_projects_for_user(user=user),
    )
    if project_id is not None:
        queryset = queryset.filter(project_id=project_id)

    return queryset.select_related(
        "primary_assignee",
        "priority",
        "status",
        "parent_task",
    ).prefetch_related("collaborators", _subtask_prefetch(), _dependency_prefetch())


def paginate_queryset(*, queryset, page: int, page_size: int):
    total_count = queryset.count()
    total_pages = max(1, ceil(total_count / page_size)) if total_count else 1
    page = max(1, min(page, total_pages))
    start = (page - 1) * page_size
    end = start + page_size
    return list(queryset[start:end]), {
        "page": page,
        "page_size": page_size,
        "total_count": total_count,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }


def _with_blocked_annotation(queryset):
    blocked_dependencies = TaskDependency.objects.filter(
        task_id=OuterRef("pk"),
        depends_on_task__deleted_at__isnull=True,
        depends_on_task__status__is_final=False,
    )
    return queryset.annotate(_is_blocked=Exists(blocked_dependencies))


def list_project_tasks_for_user(
    *,
    user,
    project_id,
    search: str | None = None,
    status_id=None,
    priority_id=None,
    assignee_id=None,
    deadline_from=None,
    deadline_to=None,
    is_blocked: bool | None = None,
    page: int,
    page_size: int,
):
    queryset = visible_tasks_for_user(user=user, project_id=project_id)

    if search:
        queryset = queryset.filter(
            Q(task_key__icontains=search)
            | Q(title__icontains=search)
            | Q(description__icontains=search)
        )
    if status_id is not None:
        queryset = queryset.filter(status_id=status_id)
    if priority_id is not None:
        queryset = queryset.filter(priority_id=priority_id)
    if assignee_id is not None:
        queryset = queryset.filter(primary_assignee_id=assignee_id)
    if deadline_from is not None:
        queryset = queryset.filter(deadline__gte=deadline_from)
    if deadline_to is not None:
        queryset = queryset.filter(deadline__lte=deadline_to)
    if is_blocked is not None:
        queryset = _with_blocked_annotation(queryset).filter(_is_blocked=is_blocked)

    queryset = queryset.order_by("task_number")
    return paginate_queryset(queryset=queryset, page=page, page_size=page_size)


def list_my_tasks_for_user(
    *,
    user,
    include_collaborator_tasks: bool,
    sort_by: str,
    page: int,
    page_size: int,
):
    queryset = visible_tasks_for_user(user=user)
    if include_collaborator_tasks:
        queryset = queryset.filter(
            Q(primary_assignee=user) | Q(collaborators=user)
        ).distinct()
    else:
        queryset = queryset.filter(primary_assignee=user)

    if sort_by == "priority":
        queryset = queryset.order_by(
            F("priority__sort_order").desc(nulls_last=True),
            F("deadline").asc(nulls_last=True),
            "task_number",
        )
    else:
        queryset = queryset.order_by(
            F("deadline").asc(nulls_last=True),
            F("priority__sort_order").desc(nulls_last=True),
            "task_number",
        )

    return paginate_queryset(queryset=queryset, page=page, page_size=page_size)


def list_task_workflow_statuses():
    return TaskWorkflowStatus.objects.order_by("sort_order", "name")


def list_task_priorities():
    return TaskPriority.objects.order_by("sort_order", "name")


def list_task_status_transitions():
    return TaskStatusTransition.objects.select_related("from_status", "to_status").order_by(
        "from_status__sort_order",
        "to_status__sort_order",
        "name",
    )
