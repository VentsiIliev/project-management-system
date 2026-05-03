import uuid

from django.conf import settings
from django.db import models


class ActivityLogEvent:
    TASK_CREATED = "TASK_CREATED"
    TASK_UPDATED = "TASK_UPDATED"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED"
    TASK_DELETED = "TASK_DELETED"
    SUBTASK_CREATED = "SUBTASK_CREATED"
    SUBTASK_DELETED = "SUBTASK_DELETED"
    DEPENDENCY_ADDED = "DEPENDENCY_ADDED"
    DEPENDENCY_REMOVED = "DEPENDENCY_REMOVED"
    COMMENT_CREATED = "COMMENT_CREATED"
    PARENT_REOPENED = "PARENT_REOPENED"
    PROJECT_DELETED = "PROJECT_DELETED"
    MEMBER_ADDED = "MEMBER_ADDED"
    MEMBER_REMOVED = "MEMBER_REMOVED"
    MEMBER_REASSIGNED = "MEMBER_REASSIGNED"


class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=64)
    message = models.TextField()
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="activity_entries",
    )
    project = models.ForeignKey(
        "projects.Project",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="activity_entries",
    )
    task = models.ForeignKey(
        "tasks.Task",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="activity_entries",
    )
    actor_name_snapshot = models.CharField(max_length=255, null=True, blank=True)
    project_code_snapshot = models.CharField(max_length=32, null=True, blank=True)
    project_name_snapshot = models.CharField(max_length=255, null=True, blank=True)
    task_key_snapshot = models.CharField(max_length=64, null=True, blank=True)
    task_title_snapshot = models.CharField(max_length=255, null=True, blank=True)
    related_user_name_snapshot = models.CharField(max_length=255, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "activity_logs"
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["project", "created_at"]),
            models.Index(fields=["task", "created_at"]),
            models.Index(fields=["event_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.event_type}:{self.id}"
