from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task


def visible_tasks_for_user(*, user, project_id):
    return Task.objects.filter(
        project_id=project_id,
        project__in=visible_projects_for_user(user=user),
    ).select_related("primary_assignee")
