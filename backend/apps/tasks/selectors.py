from django.db.models import Prefetch

from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task, TaskPriority, TaskStatusTransition, TaskWorkflowStatus


def _subtask_prefetch():
    return Prefetch(
        "subtasks",
        queryset=Task.objects.select_related("primary_assignee", "priority", "status")
        .prefetch_related("collaborators")
        .order_by("task_number"),
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
    ).prefetch_related("collaborators", _subtask_prefetch())


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
