import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient


pytestmark = pytest.mark.django_db


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
