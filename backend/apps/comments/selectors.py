from django.db.models import Q

from apps.comments.models import Comment
from apps.tasks.selectors import visible_tasks_for_user


def list_comments_for_actor(*, actor, task_id, since_comment_id=None):
    task = visible_tasks_for_user(user=actor).filter(id=task_id).first()
    if task is None:
        return None, []

    queryset = Comment.objects.select_related("author").filter(task=task).order_by("created_at", "id")
    if since_comment_id is not None:
        since_comment = Comment.objects.filter(id=since_comment_id, task=task).first()
        if since_comment is None:
            return task, None
        queryset = queryset.filter(
            Q(created_at__gt=since_comment.created_at)
            | (Q(created_at=since_comment.created_at) & ~Q(id=since_comment.id))
        )

    return task, list(queryset)
