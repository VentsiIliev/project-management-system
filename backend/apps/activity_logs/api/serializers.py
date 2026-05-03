from rest_framework import serializers


class ActivityLogSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    event_type = serializers.CharField()
    message = serializers.CharField()
    actor_name = serializers.CharField(source="actor_name_snapshot", allow_null=True)
    project_code = serializers.CharField(source="project_code_snapshot", allow_null=True)
    project_name = serializers.CharField(source="project_name_snapshot", allow_null=True)
    task_key = serializers.CharField(source="task_key_snapshot", allow_null=True)
    task_title = serializers.CharField(source="task_title_snapshot", allow_null=True)
    related_user_name = serializers.CharField(source="related_user_name_snapshot", allow_null=True)
    metadata = serializers.JSONField()
    created_at = serializers.DateTimeField()
