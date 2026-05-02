import uuid

from django.conf import settings
from django.db import models

from .managers import ActiveTaskManager, AllTaskManager


class TaskStatus(models.TextChoices):
    TODO = "TODO", "TODO"


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.RESTRICT,
        related_name="tasks",
    )
    task_number = models.PositiveIntegerField()
    task_key = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=32, choices=TaskStatus.choices, default=TaskStatus.TODO)
    primary_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_tasks",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="created_tasks",
    )
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    version = models.PositiveIntegerField(default=1)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveTaskManager()
    all_objects = AllTaskManager()

    class Meta:
        db_table = "tasks"
        ordering = ["project_id", "task_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["project", "task_number"],
                name="unique_task_number_per_project",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(deadline__isnull=True)
                    | models.Q(start_date__isnull=True)
                    | models.Q(deadline__gte=models.F("start_date"))
                ),
                name="task_deadline_on_or_after_start_date",
            ),
        ]
        indexes = [
            models.Index(fields=["project"]),
            models.Index(fields=["primary_assignee"]),
            models.Index(fields=["deadline"]),
            models.Index(fields=["deleted_at"]),
            models.Index(fields=["task_key"]),
            models.Index(fields=["title"]),
        ]

    def __str__(self) -> str:
        return self.task_key
