from rest_framework import serializers

from apps.memberships.models import ProjectMembershipRole


class CreateProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    code = serializers.CharField(max_length=32)
    description = serializers.CharField(required=False, allow_blank=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)


class UpdateProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=False)
    code = serializers.CharField(max_length=32, required=False)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)


class DeleteProjectSerializer(serializers.Serializer):
    confirm_project_delete = serializers.BooleanField(required=True)

    def validate_confirm_project_delete(self, value):
        if value is not True:
            raise serializers.ValidationError("Project deletion confirmation is required.")

        return value


class ProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    name = serializers.CharField()
    code = serializers.CharField()
    description = serializers.CharField(allow_null=True)
    owner_id = serializers.UUIDField(format="hex_verbose")
    task_counter = serializers.IntegerField()
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)


class ProjectDetailSerializer(ProjectSerializer):
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    can_manage_members = serializers.SerializerMethodField()

    def get_can_edit(self, obj):
        user = self.context["user"]
        return user.is_admin or obj.memberships.filter(
            user=user,
            role=ProjectMembershipRole.PROJECT_MANAGER,
            deleted_at__isnull=True,
        ).exists()

    def get_can_delete(self, obj):
        return self.get_can_edit(obj)

    def get_can_manage_members(self, obj):
        return self.get_can_edit(obj)
