import uuid

from django.conf import settings
from django.db import models

from .managers import ActiveMembershipManager, AllMembershipManager


class ProjectMembershipRole(models.TextChoices):
    PROJECT_MANAGER = "PROJECT_MANAGER", "Project Manager"
    TEAM_MEMBER = "TEAM_MEMBER", "Team Member"


class ProjectMembership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.RESTRICT,
        related_name="memberships",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="project_memberships",
    )
    role = models.CharField(max_length=32, choices=ProjectMembershipRole.choices)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveMembershipManager()
    all_objects = AllMembershipManager()

    class Meta:
        db_table = "project_memberships"
        ordering = ["project_id", "user_id"]
        constraints = [
            models.UniqueConstraint(
                fields=["project", "user"],
                name="unique_project_membership_per_user",
            ),
        ]
        indexes = [
            models.Index(fields=["project"]),
            models.Index(fields=["user"]),
            models.Index(fields=["deleted_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.project_id}:{self.user_id}:{self.role}"
