import uuid

from django.conf import settings
from django.db import models

from .managers import ActiveTaskManager, AllTaskManager


class TaskStatusName:
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class TaskPriorityName:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class TaskWorkflowStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=64, unique=True)
    sort_order = models.PositiveIntegerField()
    is_final = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    color = models.CharField(max_length=32, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "task_statuses"
        ordering = ["sort_order", "name"]
        indexes = [
            models.Index(fields=["sort_order"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self) -> str:
        return self.name


class TaskPriority(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=64, unique=True)
    sort_order = models.PositiveIntegerField()
    color = models.CharField(max_length=32, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "task_priorities"
        ordering = ["sort_order", "name"]
        indexes = [
            models.Index(fields=["sort_order"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self) -> str:
        return self.name


class TaskStatusTransition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_status = models.ForeignKey(
        TaskWorkflowStatus,
        on_delete=models.RESTRICT,
        related_name="outgoing_transitions",
    )
    to_status = models.ForeignKey(
        TaskWorkflowStatus,
        on_delete=models.RESTRICT,
        related_name="incoming_transitions",
    )
    name = models.CharField(max_length=128, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "task_status_transitions"
        ordering = ["from_status__sort_order", "to_status__sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["from_status", "to_status"],
                name="unique_task_status_transition",
            ),
            models.CheckConstraint(
                condition=~models.Q(from_status=models.F("to_status")),
                name="task_status_transition_no_self_reference",
            ),
        ]

    def __str__(self) -> str:
        return self.name or f"{self.from_status.name} -> {self.to_status.name}"


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
    status = models.ForeignKey(
        TaskWorkflowStatus,
        on_delete=models.RESTRICT,
        related_name="tasks",
    )
    priority = models.ForeignKey(
        TaskPriority,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="tasks",
    )
    primary_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_tasks",
    )
    collaborators = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="TaskCollaborator",
        related_name="collaborating_tasks",
        blank=True,
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
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["primary_assignee"]),
            models.Index(fields=["deadline"]),
            models.Index(fields=["deleted_at"]),
            models.Index(fields=["task_key"]),
            models.Index(fields=["title"]),
        ]

    def __str__(self) -> str:
        return self.task_key


class TaskCollaborator(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="task_collaborators",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="task_collaborations",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "task_collaborators"
        ordering = ["task_id", "user_id"]
        constraints = [
            models.UniqueConstraint(
                fields=["task", "user"],
                name="unique_task_collaborator_per_user",
            ),
        ]
        indexes = [
            models.Index(fields=["task"]),
            models.Index(fields=["user"]),
        ]

    def __str__(self) -> str:
        return f"{self.task_id}:{self.user_id}"
