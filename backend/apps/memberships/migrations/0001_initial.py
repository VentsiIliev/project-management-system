import django.db.models.deletion
import uuid

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProjectMembership",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("role", models.CharField(choices=[("PROJECT_MANAGER", "Project Manager"), ("TEAM_MEMBER", "Team Member")], max_length=32)),
                ("deleted_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        related_name="memberships",
                        to="projects.project",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        related_name="project_memberships",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "project_memberships",
                "ordering": ["project_id", "user_id"],
            },
        ),
        migrations.AddConstraint(
            model_name="projectmembership",
            constraint=models.UniqueConstraint(
                fields=("project", "user"),
                name="unique_project_membership_per_user",
            ),
        ),
        migrations.AddIndex(
            model_name="projectmembership",
            index=models.Index(fields=["project"], name="project_memb_project_ecc43d_idx"),
        ),
        migrations.AddIndex(
            model_name="projectmembership",
            index=models.Index(fields=["user"], name="project_memb_user_id_b7e42b_idx"),
        ),
        migrations.AddIndex(
            model_name="projectmembership",
            index=models.Index(fields=["deleted_at"], name="project_memb_deleted_26d95c_idx"),
        ),
    ]
