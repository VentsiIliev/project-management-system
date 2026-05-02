import uuid

from django.conf import settings
from django.db import models

from .managers import ActiveProjectManager, AllProjectManager


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=32, unique=True)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="owned_projects",
    )
    task_counter = models.PositiveIntegerField(default=0)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveProjectManager()
    all_objects = AllProjectManager()

    class Meta:
        db_table = "projects"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["owner"]),
            models.Index(fields=["deleted_at"]),
        ]

    def __str__(self) -> str:
        return self.code
