from rest_framework.permissions import BasePermission


class IsAuthenticatedAndPasswordResetComplete(BasePermission):
    message = "Authentication required."

    def has_permission(self, request, view) -> bool:
        user = request.user

        if not user or not user.is_authenticated:
            self.message = "Authentication required."
            return False

        if not user.is_active or user.deleted_at is not None:
            self.message = "Authentication required."
            return False

        if user.must_reset_password:
            self.message = "Password reset required."
            return False

        return True


class IsAdminUser(BasePermission):
    message = "Authentication required."

    def has_permission(self, request, view) -> bool:
        user = request.user

        if not user or not user.is_authenticated:
            self.message = "Authentication required."
            return False

        if not user.is_active or user.deleted_at is not None:
            self.message = "Authentication required."
            return False

        if user.must_reset_password:
            self.message = "Password reset required."
            return False

        self.message = "Admin access required."
        return bool(user.is_admin)
