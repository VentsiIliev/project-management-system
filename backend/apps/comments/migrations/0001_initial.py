from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("tasks", "0006_taskdependency"),
    ]

    operations = [
        migrations.CreateModel(
            name="Comment",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("author_name_snapshot", models.CharField(max_length=255)),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("author", models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name="comments", to=settings.AUTH_USER_MODEL)),
                ("task", models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name="comments", to="tasks.task")),
            ],
            options={
                "db_table": "comments",
                "ordering": ["created_at", "id"],
            },
        ),
        migrations.AddIndex(
            model_name="comment",
            index=models.Index(fields=["task", "created_at"], name="comments_task_cr_4e5fbf_idx"),
        ),
        migrations.AddIndex(
            model_name="comment",
            index=models.Index(fields=["author"], name="comments_author__3a4ba0_idx"),
        ),
    ]
