from rest_framework import serializers

from apps.tasks.models import Task


class CreateTaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    priority_id = serializers.UUIDField(required=False, allow_null=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)
    primary_assignee_id = serializers.UUIDField(required=False, allow_null=True)


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


class TaskSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    task_key = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(allow_null=True)
    status = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    primary_assignee = serializers.SerializerMethodField()
    start_date = serializers.DateField(allow_null=True)
    deadline = serializers.DateField(allow_null=True)
    version = serializers.IntegerField()
    created_at = serializers.DateTimeField()

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

