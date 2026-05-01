from rest_framework.permissions import BasePermission


class IsAuthenticatedAndPasswordResetComplete(BasePermission):
    message = "Password reset required."

    def has_permission(self, request, view) -> bool:
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if not user.is_active or user.deleted_at is not None:
            return False

        return not user.must_reset_password
