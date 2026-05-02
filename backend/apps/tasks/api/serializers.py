from rest_framework import serializers

from apps.tasks.models import Task


class CreateTaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)
    primary_assignee_id = serializers.UUIDField(required=False, allow_null=True)


class TaskStatusSerializer(serializers.Serializer):
    name = serializers.CharField()


class TaskAssigneeSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField()


class TaskSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    task_key = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(allow_null=True)
    status = serializers.SerializerMethodField()
    primary_assignee = serializers.SerializerMethodField()
    start_date = serializers.DateField(allow_null=True)
    deadline = serializers.DateField(allow_null=True)
    version = serializers.IntegerField()
    created_at = serializers.DateTimeField()

    def get_status(self, obj: Task):
        return TaskStatusSerializer({"name": obj.status}).data

    def get_primary_assignee(self, obj: Task):
        if obj.primary_assignee is None:
            return None

        return TaskAssigneeSerializer(
            {
                "id": obj.primary_assignee_id,
                "name": obj.primary_assignee.name,
            }
        ).data
