from django.urls import path

from .views import CurrentUserView, ForceResetPasswordView, LoginView

urlpatterns = [
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/me", CurrentUserView.as_view(), name="auth-me"),
    path(
        "auth/force-reset-password",
        ForceResetPasswordView.as_view(),
        name="auth-force-reset-password",
    ),
]
