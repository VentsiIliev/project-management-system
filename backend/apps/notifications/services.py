from django.db import transaction
from django.utils import timezone

from apps.memberships.models import ProjectMembership
from apps.notifications.models import Notification


class NotificationNotFoundError(Exception):
    pass


def _task_notification_message(*, event_type: str, actor_name: str, task_key: str) -> str:
    if event_type == "COMMENT_CREATED":
        return f"{actor_name} commented on {task_key}."
    if event_type == "TASK_CREATED":
        return f"{actor_name} created {task_key}."
    if event_type == "SUBTASK_CREATED":
        return f"{actor_name} created a subtask under {task_key}."
    if event_type == "TASK_UPDATED":
        return f"{actor_name} updated {task_key}."
    if event_type == "TASK_STATUS_CHANGED":
        return f"{actor_name} changed the status of {task_key}."
    if event_type == "TASK_DELETED":
        return f"{actor_name} deleted {task_key}."
    if event_type == "DEPENDENCY_ADDED":
        return f"{actor_name} added a dependency to {task_key}."
    if event_type == "DEPENDENCY_REMOVED":
        return f"{actor_name} removed a dependency from {task_key}."
    return f"{actor_name} changed {task_key}."


def create_task_notifications(*, task, actor, event_type: str, metadata: dict | None = None):
    from apps.comments.models import Comment

    recipient_ids = {str(task.created_by_id)}
    if task.primary_assignee_id:
        recipient_ids.add(str(task.primary_assignee_id))
    recipient_ids.update(str(user_id) for user_id in task.collaborators.values_list("id", flat=True))
    recipient_ids.update(
        str(user_id)
        for user_id in Comment.objects.filter(task=task).values_list("author_id", flat=True).distinct()
    )
    recipient_ids.discard(str(actor.id))
    if not recipient_ids:
        return

    active_member_ids = set(
        str(user_id)
        for user_id in ProjectMembership.objects.filter(
            project=task.project,
            deleted_at__isnull=True,
            user__is_active=True,
            user__deleted_at__isnull=True,
            user__must_reset_password=False,
            user_id__in=recipient_ids,
        ).values_list("user_id", flat=True)
    )
    if not active_member_ids:
        return

    message = _task_notification_message(
        event_type=event_type,
        actor_name=actor.name,
        task_key=task.task_key,
    )
    notification_metadata = {
        "task_id": str(task.id),
        "task_key": task.task_key,
        "project_id": str(task.project_id),
        **(metadata or {}),
    }
    Notification.objects.bulk_create(
        [
            Notification(
                user_id=user_id,
                event_type=event_type,
                message=message,
                metadata=notification_metadata,
            )
            for user_id in active_member_ids
        ]
    )


@transaction.atomic
def mark_notification_read(*, user, notification_id):
    notification = Notification.objects.filter(id=notification_id, user=user).first()
    if notification is None:
        raise NotificationNotFoundError

    if not notification.is_read:
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=["is_read", "read_at"])

    return notification


@transaction.atomic
def mark_all_notifications_read(*, user):
    now = timezone.now()
    return Notification.objects.filter(user=user, is_read=False).update(is_read=True, read_at=now)
