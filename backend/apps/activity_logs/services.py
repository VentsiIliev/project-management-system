from __future__ import annotations

from apps.activity_logs.models import ActivityLog


def _name_for_user(user) -> str | None:
    if user is None:
        return None
    return getattr(user, "name", None) or getattr(user, "email", None) or str(user.pk)


def _build_message(*, event_type: str, actor_name: str | None, task_key: str | None, task_title: str | None, related_user_name: str | None, metadata: dict) -> str:
    actor_prefix = actor_name or "System"
    task_label = f"{task_key} {task_title}".strip() if task_key or task_title else "task"
    if event_type == "TASK_CREATED":
        return f"{actor_prefix} created {task_label}."
    if event_type == "SUBTASK_CREATED":
        parent_key = metadata.get("parent_task_key")
        return f"{actor_prefix} created subtask {task_label} under {parent_key}."
    if event_type == "TASK_UPDATED":
        return f"{actor_prefix} updated {task_label}."
    if event_type == "TASK_ASSIGNED":
        assignee = related_user_name or "a project member"
        return f"{actor_prefix} assigned {task_label} to {assignee}."
    if event_type == "TASK_STATUS_CHANGED":
        from_status = metadata.get("from_status")
        to_status = metadata.get("to_status")
        return f"{actor_prefix} changed {task_label} from {from_status} to {to_status}."
    if event_type == "TASK_DELETED":
        return f"{actor_prefix} deleted {task_label}."
    if event_type == "SUBTASK_DELETED":
        return f"{actor_prefix} deleted subtask {task_label}."
    if event_type == "DEPENDENCY_ADDED":
        dependency_key = metadata.get("depends_on_task_key")
        return f"{actor_prefix} added dependency {dependency_key} to {task_label}."
    if event_type == "DEPENDENCY_REMOVED":
        dependency_key = metadata.get("depends_on_task_key")
        return f"{actor_prefix} removed dependency {dependency_key} from {task_label}."
    if event_type == "PARENT_REOPENED":
        child_key = metadata.get("trigger_task_key")
        return f"{task_label} reopened automatically after {child_key} moved back to active work."
    if event_type == "PROJECT_DELETED":
        project_label = metadata.get("project_code") or metadata.get("project_name") or "project"
        return f"{actor_prefix} deleted project {project_label}."
    if event_type == "MEMBER_ADDED":
        return f"{actor_prefix} added {related_user_name} to the project."
    if event_type == "MEMBER_REMOVED":
        return f"{actor_prefix} removed {related_user_name} from the project."
    if event_type == "MEMBER_REASSIGNED":
        role = metadata.get("role")
        return f"{actor_prefix} changed {related_user_name} to {role}."

    return f"{actor_prefix} recorded {event_type} for {task_label}."


def record_activity(
    *,
    event_type: str,
    actor=None,
    project=None,
    task=None,
    related_user=None,
    metadata: dict | None = None,
):
    metadata = metadata or {}
    actor_name = _name_for_user(actor)
    related_user_name = _name_for_user(related_user)
    project_code = getattr(project, "code", None)
    project_name = getattr(project, "name", None)
    task_key = getattr(task, "task_key", None)
    task_title = getattr(task, "title", None)
    message = _build_message(
        event_type=event_type,
        actor_name=actor_name,
        task_key=task_key,
        task_title=task_title,
        related_user_name=related_user_name,
        metadata={
            **metadata,
            "project_code": project_code,
            "project_name": project_name,
        },
    )
    return ActivityLog.objects.create(
        event_type=event_type,
        message=message,
        actor=actor,
        project=project,
        task=task,
        actor_name_snapshot=actor_name,
        project_code_snapshot=project_code,
        project_name_snapshot=project_name,
        task_key_snapshot=task_key,
        task_title_snapshot=task_title,
        related_user_name_snapshot=related_user_name,
        metadata=metadata,
    )
