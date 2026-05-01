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


class IsAdminUser(BasePermission):
    message = "Admin access required."

    def has_permission(self, request, view) -> bool:
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if not user.is_active or user.deleted_at is not None:
            return False

        if user.must_reset_password:
            self.message = "Password reset required."
            return False

        return bool(user.is_admin)
