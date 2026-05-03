import uuid

from django.conf import settings
from django.db import models


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        "tasks.Task",
        on_delete=models.RESTRICT,
        related_name="comments",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="comments",
    )
    author_name_snapshot = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comments"
        ordering = ["created_at", "id"]
        indexes = [
            models.Index(fields=["task", "created_at"]),
            models.Index(fields=["author"]),
        ]

    def __str__(self) -> str:
        return f"{self.task_id}:{self.id}"
