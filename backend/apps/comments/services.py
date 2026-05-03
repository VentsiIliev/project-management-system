from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import transaction

from apps.activity_logs.models import ActivityLogEvent
from apps.activity_logs.services import record_activity
from apps.comments.models import Comment
from apps.notifications.services import create_task_notifications
from apps.tasks.domain.services import TaskNotFoundError
from apps.tasks.selectors import visible_tasks_for_user


class InvalidCommentError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid comment.")
        self.details = details


def serialize_comment(comment: Comment) -> dict:
    return {
        "id": str(comment.id),
        "task_id": str(comment.task_id),
        "author": {
            "id": str(comment.author_id),
            "name": comment.author_name_snapshot,
        },
        "content": comment.content,
        "created_at": comment.created_at.isoformat().replace("+00:00", "Z"),
    }


@transaction.atomic
def create_comment(*, actor, task_id, content: str):
    normalized_content = content.strip()
    if not normalized_content:
        raise InvalidCommentError({"content": ["Comment content cannot be empty."]})

    task = (
        visible_tasks_for_user(user=actor)
        .select_related("project", "created_by", "primary_assignee", "status")
        .prefetch_related("collaborators")
        .filter(id=task_id)
        .first()
    )
    if task is None:
        raise TaskNotFoundError

    comment = Comment.objects.create(
        task=task,
        author=actor,
        author_name_snapshot=actor.name,
        content=normalized_content,
    )
    record_activity(
        event_type=ActivityLogEvent.COMMENT_CREATED,
        actor=actor,
        project=task.project,
        task=task,
        metadata={"comment_id": str(comment.id)},
    )
    create_task_notifications(
        task=task,
        actor=actor,
        event_type=ActivityLogEvent.COMMENT_CREATED,
        metadata={"comment_id": str(comment.id)},
    )

    payload = serialize_comment(comment)
    channel_layer = get_channel_layer()
    if channel_layer is not None:
        transaction.on_commit(
            lambda: async_to_sync(channel_layer.group_send)(
                f"task-comments-{task.id}",
                {
                    "type": "comment.created",
                    "comment": payload,
                },
            )
        )

    return comment
