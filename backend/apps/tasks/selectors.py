from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task, TaskPriority, TaskStatusTransition, TaskWorkflowStatus


def visible_tasks_for_user(*, user, project_id):
    return Task.objects.filter(
        project_id=project_id,
        project__in=visible_projects_for_user(user=user),
    ).select_related("primary_assignee", "priority", "status")


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
