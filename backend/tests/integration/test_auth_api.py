import pytest
from django.test import override_settings
from django.urls import include, path
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.test import APIClient
from rest_framework.views import APIView

from apps.users.api.permissions import IsAuthenticatedAndPasswordResetComplete


pytestmark = pytest.mark.django_db


class ProtectedAppView(APIView):
    permission_classes = [IsAuthenticatedAndPasswordResetComplete]

    def get(self, request):
        return Response({"status": "ok"})


class PublicProbeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


urlpatterns = [
    path("", include("config.urls")),
    path("api/test/protected-app/", ProtectedAppView.as_view(), name="test-protected-app"),
    path("api/test/public-probe/", PublicProbeView.as_view(), name="test-public-probe"),
]


def create_user(**overrides):
    user_model = get_user_model()
    password = overrides.pop("password", "valid-password")
    defaults = {
        "email": "user@example.com",
        "name": "Jane Doe",
        "must_reset_password": False,
    }
    defaults.update(overrides)
    return user_model.objects.create_user(password=password, **defaults)


def test_login_success_creates_session_returns_profile_and_updates_last_login():
    user = create_user()
    client = APIClient()

    response = client.post(
        "/api/auth/login",
        {"email": user.email, "password": "valid-password"},
        format="json",
    )

    user.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "is_admin": False,
            "must_reset_password": False,
        },
        "requires_password_reset": False,
    }
    assert client.session["_auth_user_id"] == str(user.id)
    assert user.last_login_at is not None


def test_login_success_indicates_when_password_reset_is_required():
    user = create_user(email="reset@example.com", must_reset_password=True)
    client = APIClient()

    response = client.post(
        "/api/auth/login",
        {"email": user.email, "password": "valid-password"},
        format="json",
    )

    assert response.status_code == 200
    assert response.json()["requires_password_reset"] is True
    assert response.json()["user"]["must_reset_password"] is True


def test_force_reset_password_succeeds_and_returns_refreshed_session_user():
    user = create_user(email="force-reset@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    response = client.post(
        "/api/auth/force-reset-password",
        {"new_password": "better-password-123"},
        format="json",
    )

    user.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "is_admin": False,
            "must_reset_password": False,
        },
        "requires_password_reset": False,
    }
    assert user.must_reset_password is False
    assert user.check_password("better-password-123") is True
    assert user.check_password("valid-password") is False


def test_force_reset_password_rejects_invalid_new_password_with_field_errors():
    user = create_user(email="weak-password@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    response = client.post(
        "/api/auth/force-reset-password",
        {"new_password": "short"},
        format="json",
    )

    user.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "new_password": [
                    "This password is too short. It must contain at least 8 characters."
                ]
            },
        }
    }
    assert user.must_reset_password is True
    assert user.check_password("valid-password") is True


def test_force_reset_password_requires_authentication():
    client = APIClient()

    response = client.post(
        "/api/auth/force-reset-password",
        {"new_password": "better-password-123"},
        format="json",
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }


def test_force_reset_password_rejects_users_who_do_not_require_reset():
    user = create_user(email="no-reset-needed@example.com", must_reset_password=False)
    client = APIClient()
    client.force_login(user)

    response = client.post(
        "/api/auth/force-reset-password",
        {"new_password": "better-password-123"},
        format="json",
    )

    user.refresh_from_db()

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PASSWORD_RESET_NOT_REQUIRED",
            "message": "Password reset is not required for this user.",
            "details": {},
        }
    }
    assert user.must_reset_password is False
    assert user.check_password("valid-password") is True


def test_current_user_returns_authenticated_profile_for_reset_required_user():
    user = create_user(email="reset-bootstrap@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/auth/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "is_admin": False,
        "must_reset_password": True,
    }


def test_login_requires_csrf_token():
    user = create_user(email="csrf@example.com")
    client = APIClient(enforce_csrf_checks=True)

    response = client.post(
        "/api/auth/login",
        {"email": user.email, "password": "valid-password"},
        format="json",
    )

    assert response.status_code == 403


def test_login_succeeds_with_valid_csrf_token():
    user = create_user(email="csrf-success@example.com")
    client = APIClient(enforce_csrf_checks=True)

    csrf_response = client.get("/api/auth/me")
    csrf_token = csrf_response.cookies["csrftoken"].value

    response = client.post(
        "/api/auth/login",
        {"email": user.email, "password": "valid-password"},
        format="json",
        HTTP_X_CSRFTOKEN=csrf_token,
    )

    assert response.status_code == 200
    assert response.json()["user"]["email"] == user.email


@pytest.mark.parametrize(
    ("user_kwargs", "email", "password"),
    [
        ({}, "user@example.com", "wrong-password"),
        ({"is_active": False}, "user@example.com", "valid-password"),
        ({"deleted_at": timezone.now()}, "user@example.com", "valid-password"),
    ],
)
def test_login_rejections_return_generic_invalid_credentials_error(
    user_kwargs,
    email,
    password,
):
    create_user(**user_kwargs)
    client = APIClient()

    response = client.post(
        "/api/auth/login",
        {"email": email, "password": password},
        format="json",
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "INVALID_CREDENTIALS",
            "message": "Invalid email or password.",
            "details": {},
        }
    }
    assert "_auth_user_id" not in client.session


def test_current_user_returns_authenticated_profile():
    user = create_user()
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/auth/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "is_admin": False,
        "must_reset_password": False,
    }


@override_settings(ROOT_URLCONF=__name__)
def test_reset_required_user_is_blocked_from_protected_endpoints():
    user = create_user(email="blocked@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/test/protected-app/")

    assert response.status_code == 403
    assert response.json() == {"detail": "Password reset required."}


@override_settings(ROOT_URLCONF=__name__)
def test_reset_complete_user_can_access_protected_endpoints():
    user = create_user(email="allowed@example.com", must_reset_password=False)
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/test/protected-app/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@override_settings(ROOT_URLCONF=__name__)
def test_public_endpoints_can_still_allow_reset_required_users_when_explicitly_configured():
    user = create_user(email="public@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/test/public-probe/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@override_settings(ROOT_URLCONF=__name__)
def test_reset_required_user_can_access_protected_endpoints_after_successful_forced_reset():
    user = create_user(email="post-reset@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    reset_response = client.post(
        "/api/auth/force-reset-password",
        {"new_password": "better-password-123"},
        format="json",
    )
    protected_response = client.get("/api/test/protected-app/")

    user.refresh_from_db()

    assert reset_response.status_code == 200
    assert user.must_reset_password is False
    assert protected_response.status_code == 200
    assert protected_response.json() == {"status": "ok"}


def test_current_user_requires_authentication():
    client = APIClient()

    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert "csrftoken" in response.cookies
    assert response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }


def test_current_user_rejects_inactive_authenticated_session():
    user = create_user(is_active=False)
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }


def test_current_user_rejects_soft_deleted_authenticated_session():
    user = create_user(deleted_at=timezone.now())
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }
