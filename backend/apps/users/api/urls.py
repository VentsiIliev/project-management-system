from django.urls import path

from .views import CurrentUserView, ForceResetPasswordView, LoginView, LogoutView

urlpatterns = [
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/logout", LogoutView.as_view(), name="auth-logout"),
    path("auth/me", CurrentUserView.as_view(), name="auth-me"),
    path(
        "auth/force-reset-password",
        ForceResetPasswordView.as_view(),
        name="auth-force-reset-password",
    ),
]
