from dataclasses import dataclass

from django.conf import settings
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone


class InvalidCredentialsError(Exception):
    pass


@dataclass(frozen=True)
class AuthenticatedSession:
    user: object
    requires_password_reset: bool


def serialize_session_user(user) -> dict[str, str | bool]:
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "is_admin": user.is_admin,
        "must_reset_password": user.must_reset_password,
    }


def get_active_session_user(request):
    user = request.user
    if not user.is_authenticated:
        return None

    if user.deleted_at is not None or not user.is_active:
        django_logout(request)
        return None

    return user


@transaction.atomic
def authenticate_user_session(*, request, email: str, password: str) -> AuthenticatedSession:
    user_model = get_user_model()
    normalized_email = user_model.objects.normalize_email(email).lower()
    user = (
        user_model.all_objects.select_for_update()
        .filter(email__iexact=normalized_email)
        .first()
    )

    if user is None or user.deleted_at is not None or not user.is_active:
        raise InvalidCredentialsError

    if not user.check_password(password):
        raise InvalidCredentialsError

    user.last_login_at = timezone.now()
    user.save(update_fields=["last_login_at", "updated_at"])
    django_login(request, user, backend=settings.AUTHENTICATION_BACKENDS[0])

    return AuthenticatedSession(
        user=user,
        requires_password_reset=user.must_reset_password,
    )
