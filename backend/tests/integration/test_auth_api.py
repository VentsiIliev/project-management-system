from datetime import timedelta

import pytest
from django.conf import settings
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


def test_logout_invalidates_the_authenticated_session():
    user = create_user(email="logout@example.com", must_reset_password=False)
    client = APIClient()
    client.force_login(user)

    logout_response = client.post("/api/auth/logout")
    session_response = client.get("/api/auth/me")

    assert logout_response.status_code == 204
    assert session_response.status_code == 401
    assert session_response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }


def test_logout_allows_reset_required_users_to_end_their_session():
    user = create_user(email="reset-logout@example.com", must_reset_password=True)
    client = APIClient()
    client.force_login(user)

    logout_response = client.post("/api/auth/logout")
    session_response = client.get("/api/auth/me")

    assert logout_response.status_code == 204
    assert session_response.status_code == 401


def test_logout_requires_authentication():
    client = APIClient()

    response = client.post("/api/auth/logout")

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


def test_session_timeout_settings_match_the_spec():
    assert settings.SESSION_COOKIE_AGE == 28800
    assert settings.SESSION_SAVE_EVERY_REQUEST is True


def test_expired_session_is_treated_as_unauthenticated_on_the_next_request():
    user = create_user(email="expired@example.com")
    client = APIClient()
    client.force_login(user)

    session = client.session
    session.set_expiry(timezone.now() - timedelta(seconds=1))
    session.save()

    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "UNAUTHENTICATED",
            "message": "Authentication required.",
            "details": {},
        }
    }


def test_authenticated_requests_refresh_the_session_timeout_cookie():
    user = create_user(email="rolling-timeout@example.com")
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/auth/me")

    assert response.status_code == 200
    assert "sessionid" in response.cookies
    assert int(response.cookies["sessionid"]["max-age"]) == settings.SESSION_COOKIE_AGE
    assert response.cookies["sessionid"]["expires"]


def test_admin_can_create_a_user_with_a_temporary_password():
    admin_user = create_user(
        email="admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/admin/users",
        {
            "name": "New User",
            "email": "new.user@example.com",
            "temporary_password": "TempPassword123!",
            "is_active": True,
        },
        format="json",
    )

    created_user = get_user_model().all_objects.get(email="new.user@example.com")

    assert response.status_code == 201
    assert response.json() == {
        "user": {
            "id": str(created_user.id),
            "email": "new.user@example.com",
            "name": "New User",
            "is_active": True,
            "is_admin": False,
            "must_reset_password": True,
        }
    }
    assert created_user.is_active is True
    assert created_user.is_admin is False
    assert created_user.must_reset_password is True
    assert created_user.check_password("TempPassword123!") is True
    assert created_user.password != "TempPassword123!"


def test_create_user_rejects_duplicate_email_with_a_validation_error():
    admin_user = create_user(
        email="admin.duplicate@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    create_user(email="existing@example.com")
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/admin/users",
        {
            "name": "Existing Clone",
            "email": "existing@example.com",
            "temporary_password": "TempPassword123!",
            "is_active": True,
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "email": ["A user with this email already exists."],
            },
        }
    }


def test_create_user_denies_non_admin_users():
    standard_user = create_user(
        email="member@example.com",
        is_admin=False,
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(standard_user)

    response = client.post(
        "/api/admin/users",
        {
            "name": "Denied User",
            "email": "denied@example.com",
            "temporary_password": "TempPassword123!",
        },
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Admin access required."}


def test_create_user_validates_the_temporary_password_against_the_password_policy():
    admin_user = create_user(
        email="admin.password@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/admin/users",
        {
            "name": "Weak Password User",
            "email": "weak.password@example.com",
            "temporary_password": "short",
            "is_active": True,
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "temporary_password": [
                    "This password is too short. It must contain at least 8 characters."
                ]
            },
        }
    }
    assert get_user_model().all_objects.filter(email="weak.password@example.com").exists() is False


def test_admin_can_update_name_email_and_active_status_for_an_existing_user():
    admin_user = create_user(
        email="admin.update@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(email="person.before@example.com", name="Before Name")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/admin/users/{managed_user.id}",
        {
            "name": "After Name",
            "email": "person.after@example.com",
            "is_active": False,
        },
        format="json",
    )

    managed_user.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": str(managed_user.id),
            "email": "person.after@example.com",
            "name": "After Name",
            "is_active": False,
            "is_admin": False,
            "must_reset_password": False,
        }
    }
    assert managed_user.name == "After Name"
    assert managed_user.email == "person.after@example.com"
    assert managed_user.is_active is False


def test_update_user_rejects_duplicate_email_with_a_validation_error():
    admin_user = create_user(
        email="admin.update-duplicate@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    create_user(email="existing.update@example.com")
    managed_user = create_user(email="change.me@example.com", name="Change Me")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/admin/users/{managed_user.id}",
        {"email": "existing.update@example.com"},
        format="json",
    )

    managed_user.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "email": ["A user with this email already exists."],
            },
        }
    }
    assert managed_user.email == "change.me@example.com"


def test_update_user_rejects_unsupported_fields_without_mutating_the_user():
    admin_user = create_user(
        email="admin.unsupported@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(email="unsupported.target@example.com", name="Supported Name")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/admin/users/{managed_user.id}",
        {
            "is_admin": True,
            "must_reset_password": True,
        },
        format="json",
    )

    managed_user.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "is_admin": ["This field is not supported."],
                "must_reset_password": ["This field is not supported."],
            },
        }
    }
    assert managed_user.is_admin is False
    assert managed_user.must_reset_password is False


def test_update_user_denies_non_admin_users():
    standard_user = create_user(
        email="member.update@example.com",
        is_admin=False,
        must_reset_password=False,
    )
    managed_user = create_user(email="managed.member@example.com")
    client = APIClient()
    client.force_login(standard_user)

    response = client.patch(
        f"/api/admin/users/{managed_user.id}",
        {"name": "Denied Update"},
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Admin access required."}


def test_update_user_returns_not_found_for_soft_deleted_users():
    admin_user = create_user(
        email="admin.soft-delete@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(
        email="soft.deleted@example.com",
        deleted_at=timezone.now(),
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/admin/users/{managed_user.id}",
        {"name": "Should Not Apply"},
        format="json",
    )

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "USER_NOT_FOUND",
            "message": "User not found.",
            "details": {},
        }
    }


def test_deactivated_users_cannot_log_in_after_an_admin_deactivates_them():
    admin_user = create_user(
        email="admin.deactivate@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(email="deactivated.later@example.com")
    admin_client = APIClient()
    admin_client.force_login(admin_user)

    update_response = admin_client.patch(
        f"/api/admin/users/{managed_user.id}",
        {"is_active": False},
        format="json",
    )

    login_client = APIClient()
    login_response = login_client.post(
        "/api/auth/login",
        {"email": managed_user.email, "password": "valid-password"},
        format="json",
    )

    managed_user.refresh_from_db()

    assert update_response.status_code == 200
    assert managed_user.is_active is False
    assert login_response.status_code == 401
    assert login_response.json() == {
        "error": {
            "code": "INVALID_CREDENTIALS",
            "message": "Invalid email or password.",
            "details": {},
        }
    }


def test_admin_can_reset_a_users_password_and_require_a_forced_reset_on_next_login():
    admin_user = create_user(
        email="admin.reset@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(
        email="reset.target@example.com",
        password="old-password-123",
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/admin/users/{managed_user.id}/reset-password",
        {"new_temporary_password": "TempPassword456!"},
        format="json",
    )

    managed_user.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": str(managed_user.id),
            "email": managed_user.email,
            "name": managed_user.name,
            "is_active": True,
            "is_admin": False,
            "must_reset_password": True,
        }
    }
    assert managed_user.must_reset_password is True
    assert managed_user.check_password("TempPassword456!") is True
    assert managed_user.check_password("old-password-123") is False

    old_login_client = APIClient()
    old_login_response = old_login_client.post(
        "/api/auth/login",
        {"email": managed_user.email, "password": "old-password-123"},
        format="json",
    )
    new_login_client = APIClient()
    new_login_response = new_login_client.post(
        "/api/auth/login",
        {"email": managed_user.email, "password": "TempPassword456!"},
        format="json",
    )

    assert old_login_response.status_code == 401
    assert new_login_response.status_code == 200
    assert new_login_response.json()["requires_password_reset"] is True
    assert new_login_response.json()["user"]["must_reset_password"] is True


def test_admin_reset_user_password_validates_the_temporary_password_policy():
    admin_user = create_user(
        email="admin.reset-policy@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(email="reset.policy.target@example.com")
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/admin/users/{managed_user.id}/reset-password",
        {"new_temporary_password": "short"},
        format="json",
    )

    managed_user.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "new_temporary_password": [
                    "This password is too short. It must contain at least 8 characters."
                ]
            },
        }
    }
    assert managed_user.check_password("valid-password") is True
    assert managed_user.must_reset_password is False


def test_reset_user_password_denies_non_admin_users():
    standard_user = create_user(
        email="member.reset@example.com",
        is_admin=False,
        must_reset_password=False,
    )
    managed_user = create_user(email="managed.reset@example.com")
    client = APIClient()
    client.force_login(standard_user)

    response = client.post(
        f"/api/admin/users/{managed_user.id}/reset-password",
        {"new_temporary_password": "TempPassword456!"},
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Admin access required."}


def test_reset_user_password_returns_not_found_for_soft_deleted_users():
    admin_user = create_user(
        email="admin.reset-soft-delete@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(
        email="soft.deleted.reset@example.com",
        deleted_at=timezone.now(),
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/admin/users/{managed_user.id}/reset-password",
        {"new_temporary_password": "TempPassword456!"},
        format="json",
    )

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "USER_NOT_FOUND",
            "message": "User not found.",
            "details": {},
        }
    }


def test_admin_reset_user_password_preserves_the_targets_existing_session():
    admin_user = create_user(
        email="admin.reset-session@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    managed_user = create_user(
        email="session.reset.target@example.com",
        password="old-password-123",
        must_reset_password=False,
    )
    target_client = APIClient()
    target_client.force_login(managed_user)
    before_response = target_client.get("/api/auth/me")

    admin_client = APIClient()
    admin_client.force_login(admin_user)
    reset_response = admin_client.post(
        f"/api/admin/users/{managed_user.id}/reset-password",
        {"new_temporary_password": "TempPassword456!"},
        format="json",
    )

    managed_user.refresh_from_db()
    after_response = target_client.get("/api/auth/me")

    assert before_response.status_code == 200
    assert reset_response.status_code == 200
    assert managed_user.must_reset_password is True
    assert after_response.status_code == 200
    assert after_response.json() == {
        "id": str(managed_user.id),
        "email": managed_user.email,
        "name": managed_user.name,
        "is_admin": False,
        "must_reset_password": True,
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
