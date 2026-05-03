from apps.activity_logs.models import ActivityLog
from apps.projects.selectors import visible_projects_for_user
from apps.tasks.models import Task


def list_project_activity_for_actor(*, actor, project_id):
    project = visible_projects_for_user(user=actor).filter(id=project_id).first()
    if project is None:
        return None, []

    entries = list(ActivityLog.objects.filter(project=project).order_by("-created_at", "-id"))
    return project, entries


def list_task_activity_for_actor(*, actor, task_id):
    task = (
        Task.all_objects.select_related("project")
        .filter(id=task_id, project__in=visible_projects_for_user(user=actor))
        .first()
    )
    if task is None:
        return None, []

    entries = list(ActivityLog.objects.filter(task_id=task.id).order_by("-created_at", "-id"))
    return task, entries
