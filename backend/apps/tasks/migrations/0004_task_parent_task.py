from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0003_taskcollaborator_task_collaborators_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="parent_task",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="subtasks",
                to="tasks.task",
            ),
        ),
        migrations.AddIndex(
            model_name="task",
            index=models.Index(fields=["parent_task"], name="tasks_task_parent__ddcf5b_idx"),
        ),
        migrations.AddConstraint(
            model_name="task",
            constraint=models.CheckConstraint(
                condition=models.Q(parent_task__isnull=True)
                | ~models.Q(parent_task=models.F("id")),
                name="task_parent_task_cannot_reference_self",
            ),
        ),
    ]
