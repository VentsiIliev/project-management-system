from django.urls import path

from .views import (
    AdminUserDetailView,
    AdminUserListCreateView,
    AdminUserPasswordResetView,
    CurrentUserView,
    ForceResetPasswordView,
    LoginView,
    LogoutView,
)

urlpatterns = [
    path("admin/users", AdminUserListCreateView.as_view(), name="admin-users"),
    path("admin/users/<uuid:user_id>", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path(
        "admin/users/<uuid:user_id>/reset-password",
        AdminUserPasswordResetView.as_view(),
        name="admin-user-reset-password",
    ),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/logout", LogoutView.as_view(), name="auth-logout"),
    path("auth/me", CurrentUserView.as_view(), name="auth-me"),
    path(
        "auth/force-reset-password",
        ForceResetPasswordView.as_view(),
        name="auth-force-reset-password",
    ),
]
