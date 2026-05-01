from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class ForceResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(trim_whitespace=False)


class CreateUserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    temporary_password = serializers.CharField(trim_whitespace=False)
    is_active = serializers.BooleanField(required=False, default=True)


class UpdateUserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=False)
    email = serializers.EmailField(required=False)
    is_active = serializers.BooleanField(required=False)

    def validate(self, attrs):
        allowed_fields = {"name", "email", "is_active"}
        unsupported_fields = sorted(set(self.initial_data.keys()) - allowed_fields)

        if unsupported_fields:
            raise serializers.ValidationError(
                {
                    field: ["This field is not supported."]
                    for field in unsupported_fields
                }
            )

        if not attrs:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        "At least one supported field must be provided."
                    ]
                }
            )

        return attrs


class SessionUserSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    email = serializers.EmailField()
    name = serializers.CharField()
    is_admin = serializers.BooleanField()
    must_reset_password = serializers.BooleanField()


class AdminUserSerializer(serializers.Serializer):
    id = serializers.UUIDField(format="hex_verbose")
    email = serializers.EmailField()
    name = serializers.CharField()
    is_active = serializers.BooleanField()
    is_admin = serializers.BooleanField()
    must_reset_password = serializers.BooleanField()
