import django.db.models.deletion
import uuid

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("code", models.CharField(max_length=32, unique=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("task_counter", models.PositiveIntegerField(default=0)),
                ("start_date", models.DateField(blank=True, null=True)),
                ("end_date", models.DateField(blank=True, null=True)),
                ("deleted_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        related_name="owned_projects",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "projects",
                "ordering": ["name"],
            },
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["owner"], name="projects_pro_owner_i_5ca346_idx"),
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["deleted_at"], name="projects_pro_deleted_0ea4cb_idx"),
        ),
    ]
