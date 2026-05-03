from rest_framework import serializers

from apps.tasks.domain.services import is_task_blocked
from apps.tasks.models import Task


class CreateTaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    priority_id = serializers.UUIDField(required=False, allow_null=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)
    primary_assignee_id = serializers.UUIDField(required=False, allow_null=True)
    parent_task_id = serializers.UUIDField(required=False, allow_null=True)
    collaborator_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        allow_empty=True,
    )


class UpdateTaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    priority_id = serializers.UUIDField(required=False, allow_null=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)
    primary_assignee_id = serializers.UUIDField(required=False, allow_null=True)
    collaborator_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        allow_empty=True,
    )
    version = serializers.IntegerField(min_value=1)

    def validate(self, attrs):
        mutable_fields = {
            "title",
            "description",
            "priority_id",
            "start_date",
            "deadline",
            "primary_assignee_id",
            "collaborator_ids",
        }
        if not any(field in attrs for field in mutable_fields):
            raise serializers.ValidationError(
                {"non_field_errors": ["At least one task field must be updated."]}
            )

        return attrs


class ChangeTaskStatusSerializer(serializers.Serializer):
    to_status_id = serializers.UUIDField()
    version = serializers.IntegerField(min_value=1)


class DeleteTaskSerializer(serializers.Serializer):
    confirm_cascade_subtasks = serializers.BooleanField(required=False, default=False)


class AddTaskDependencySerializer(serializers.Serializer):
    depends_on_task_id = serializers.UUIDField()


class TaskListQuerySerializer(serializers.Serializer):
    search = serializers.CharField(required=False, allow_blank=False, trim_whitespace=True)
    status_id = serializers.UUIDField(required=False)
    priority_id = serializers.UUIDField(required=False)
    assignee_id = serializers.UUIDField(required=False)
    deadline_from = serializers.DateField(required=False)
    deadline_to = serializers.DateField(required=False)
    is_blocked = serializers.BooleanField(required=False)
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    page_size = serializers.IntegerField(required=False, min_value=1, max_value=100, default=10)

    def validate(self, attrs):
        deadline_from = attrs.get("deadline_from")
        deadline_to = attrs.get("deadline_to")
        if deadline_from and deadline_to and deadline_to < deadline_from:
            raise serializers.ValidationError(
                {"deadline_to": ["Deadline end cannot be earlier than deadline start."]}
            )
        return attrs


class MyTaskListQuerySerializer(serializers.Serializer):
    include_collaborator_tasks = serializers.BooleanField(required=False, default=False)
    sort_by = serializers.ChoiceField(required=False, choices=["deadline", "priority"], default="deadline")
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    page_size = serializers.IntegerField(required=False, min_value=1, max_value=100, default=10)


class TaskStatusSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField()
    sort_order = serializers.IntegerField()
    is_final = serializers.BooleanField()
    is_active = serializers.BooleanField()
    color = serializers.CharField(allow_null=True)


class TaskPrioritySerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField()
    sort_order = serializers.IntegerField()
    is_active = serializers.BooleanField()
    color = serializers.CharField(allow_null=True)


class TaskStatusTransitionSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField(allow_null=True)
    is_active = serializers.BooleanField()
    from_status_id = serializers.UUIDField(format="hex_verbose")
    to_status_id = serializers.UUIDField(format="hex_verbose")


class TaskAssigneeSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField()


class TaskDependencySummarySerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    task_key = serializers.CharField()
    title = serializers.CharField()
    parent_task_id = serializers.UUIDField(format="hex_verbose", allow_null=True)
    status = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()

    def get_status(self, obj: Task):
        status = obj.status
        return TaskStatusSerializer(
            {
                "id": status.id,
                "name": status.name,
                "sort_order": status.sort_order,
                "is_final": status.is_final,
                "is_active": status.is_active,
                "color": status.color,
            }
        ).data

    def get_is_blocked(self, obj: Task):
        return is_task_blocked(obj)


class TaskSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    task_key = serializers.CharField()
    project_id = serializers.UUIDField(format="hex_verbose")
    parent_task_id = serializers.UUIDField(format="hex_verbose", allow_null=True)
    title = serializers.CharField()
    description = serializers.CharField(allow_null=True)
    status = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    primary_assignee = serializers.SerializerMethodField()
    collaborators = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    start_date = serializers.DateField(allow_null=True)
    deadline = serializers.DateField(allow_null=True)
    version = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    subtasks = serializers.SerializerMethodField()
    dependencies = serializers.SerializerMethodField()

    def get_status(self, obj: Task):
        status = obj.status
        return TaskStatusSerializer(
            {
                "id": status.id,
                "name": status.name,
                "sort_order": status.sort_order,
                "is_final": status.is_final,
                "is_active": status.is_active,
                "color": status.color,
            }
        ).data

    def get_priority(self, obj: Task):
        if obj.priority is None:
            return None

        priority = obj.priority
        return TaskPrioritySerializer(
            {
                "id": priority.id,
                "name": priority.name,
                "sort_order": priority.sort_order,
                "is_active": priority.is_active,
                "color": priority.color,
            }
        ).data

    def get_primary_assignee(self, obj: Task):
        if obj.primary_assignee is None:
            return None

        return TaskAssigneeSerializer(
            {
                "id": obj.primary_assignee_id,
                "name": obj.primary_assignee.name,
            }
        ).data

    def get_collaborators(self, obj: Task):
        collaborators = sorted(obj.collaborators.all(), key=lambda user: (user.name, str(user.id)))
        return TaskAssigneeSerializer(
            [{"id": user.id, "name": user.name} for user in collaborators],
            many=True,
        ).data

    def get_is_blocked(self, obj: Task):
        return is_task_blocked(obj)

    def get_is_overdue(self, obj: Task):
        if obj.deadline is None or obj.status.is_final:
            return False

        from django.utils import timezone

        return obj.deadline < timezone.localdate()

    def get_subtasks(self, obj: Task):
        subtasks = getattr(obj, "_prefetched_objects_cache", {}).get("subtasks")
        if subtasks is None:
            subtasks = obj.subtasks.select_related("primary_assignee", "priority", "status").prefetch_related(
                "collaborators"
            )

        return TaskSerializer(subtasks, many=True).data

    def get_dependencies(self, obj: Task):
        dependency_links = getattr(obj, "_prefetched_objects_cache", {}).get("dependency_links")
        if dependency_links is None:
            dependency_links = (
                obj.dependency_links.filter(depends_on_task__deleted_at__isnull=True)
                .select_related("depends_on_task", "depends_on_task__status")
                .order_by("depends_on_task__task_number")
            )

        dependencies = [link.depends_on_task for link in dependency_links]
        return TaskDependencySummarySerializer(dependencies, many=True).data
