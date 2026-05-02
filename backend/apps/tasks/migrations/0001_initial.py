import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("projects", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Task",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("task_number", models.PositiveIntegerField()),
                ("task_key", models.CharField(max_length=64, unique=True)),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                ("status", models.CharField(choices=[("TODO", "TODO")], default="TODO", max_length=32)),
                ("start_date", models.DateField(blank=True, null=True)),
                ("deadline", models.DateField(blank=True, null=True)),
                ("version", models.PositiveIntegerField(default=1)),
                ("deleted_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name="created_tasks", to=settings.AUTH_USER_MODEL)),
                ("primary_assignee", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="assigned_tasks", to=settings.AUTH_USER_MODEL)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name="tasks", to="projects.project")),
            ],
            options={
                "db_table": "tasks",
                "ordering": ["project_id", "task_number"],
            },
        ),
        migrations.AddConstraint(
            model_name="task",
            constraint=models.UniqueConstraint(fields=("project", "task_number"), name="unique_task_number_per_project"),
        ),
        migrations.AddConstraint(
            model_name="task",
            constraint=models.CheckConstraint(condition=models.Q(("deadline__isnull", True), ("start_date__isnull", True), _connector="OR") | models.Q(("deadline__gte", models.F("start_date"))), name="task_deadline_on_or_after_start_date"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["project"], name="tasks_project_f1bd77_idx"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["primary_assignee"], name="tasks_primary_8b7d3a_idx"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["deadline"], name="tasks_deadlin_7f16a6_idx"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["deleted_at"], name="tasks_deleted_1d9a30_idx"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["task_key"], name="tasks_task_ke_70dea1_idx"),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["title"], name="tasks_title_b13983_idx"),
        ),
    ]
