from django.urls import path

from .views import CurrentUserView, LoginView

urlpatterns = [
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/me", CurrentUserView.as_view(), name="auth-me"),
]
