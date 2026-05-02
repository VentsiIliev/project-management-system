from rest_framework import serializers

from apps.memberships.models import ProjectMembershipRole


class AddProjectMemberSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(format="hex_verbose")
    role = serializers.ChoiceField(choices=ProjectMembershipRole.choices)


class ProjectMemberSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(format="hex_verbose", source="user.id")
    email = serializers.EmailField(source="user.email")
    name = serializers.CharField(source="user.name")
    is_active = serializers.BooleanField(source="user.is_active")
    role = serializers.CharField()
