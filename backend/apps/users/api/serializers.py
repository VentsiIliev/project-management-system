from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class SessionUserSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    email = serializers.EmailField()
    name = serializers.CharField()
    is_admin = serializers.BooleanField()
    must_reset_password = serializers.BooleanField()
