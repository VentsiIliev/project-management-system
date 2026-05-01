from dataclasses import dataclass

from django.conf import settings
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import (
    CommonPasswordValidator,
    MinimumLengthValidator,
    NumericPasswordValidator,
    UserAttributeSimilarityValidator,
    password_changed,
    validate_password,
)
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone


class InvalidCredentialsError(Exception):
    pass


class PasswordResetNotRequiredError(Exception):
    pass


class PasswordValidationFailedError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Password validation failed.")
        self.details = details


class DuplicateEmailError(Exception):
    pass


class UserNotFoundError(Exception):
    pass


@dataclass(frozen=True)
class AuthenticatedSession:
    user: object
    requires_password_reset: bool


DEFAULT_PASSWORD_VALIDATORS = [
    UserAttributeSimilarityValidator(),
    MinimumLengthValidator(),
    CommonPasswordValidator(),
    NumericPasswordValidator(),
]


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


def logout_user_session(*, request) -> bool:
    session_user = get_active_session_user(request)
    if session_user is None:
        return False

    django_logout(request)
    return True


def validate_user_password(*, user, password: str, field_name: str = "new_password") -> None:
    try:
        if getattr(settings, "AUTH_PASSWORD_VALIDATORS", None):
            validate_password(password, user=user)
        else:
            validate_password(
                password,
                user=user,
                password_validators=DEFAULT_PASSWORD_VALIDATORS,
            )
    except ValidationError as exc:
        raise PasswordValidationFailedError({field_name: exc.messages}) from exc


@transaction.atomic
def create_user_account(*, actor, name: str, email: str, temporary_password: str, is_active: bool = True):
    user_model = get_user_model()
    normalized_email = user_model.objects.normalize_email(email).lower()

    if user_model.all_objects.filter(email__iexact=normalized_email).exists():
        raise DuplicateEmailError

    provisional_user = user_model(
        email=normalized_email,
        name=name,
        is_active=is_active,
        is_admin=False,
        must_reset_password=True,
    )
    validate_user_password(
        user=provisional_user,
        password=temporary_password,
        field_name="temporary_password",
    )

    created_user = user_model.all_objects.create_user(
        email=normalized_email,
        password=temporary_password,
        name=name,
        is_active=is_active,
        is_admin=False,
        must_reset_password=True,
    )

    return created_user


@transaction.atomic
def update_user_account(
    *,
    actor,
    user_id,
    name=None,
    email=None,
    is_active=None,
):
    user_model = get_user_model()
    user = (
        user_model.all_objects.select_for_update()
        .filter(pk=user_id, deleted_at__isnull=True)
        .first()
    )

    if user is None:
        raise UserNotFoundError

    update_fields = []

    if name is not None:
        user.name = name
        update_fields.append("name")

    if email is not None:
        normalized_email = user_model.objects.normalize_email(email).lower()
        if user_model.all_objects.filter(email__iexact=normalized_email).exclude(pk=user.pk).exists():
            raise DuplicateEmailError

        user.email = normalized_email
        update_fields.append("email")

    if is_active is not None:
        user.is_active = is_active
        update_fields.append("is_active")

    if update_fields:
        user.save(update_fields=[*update_fields, "updated_at"])

    return user


@transaction.atomic
def force_reset_password(*, request, user, new_password: str):
    locked_user = user.__class__.all_objects.select_for_update().get(pk=user.pk)

    if locked_user.deleted_at is not None or not locked_user.is_active:
        django_logout(request)
        return None

    if not locked_user.must_reset_password:
        raise PasswordResetNotRequiredError

    validate_user_password(user=locked_user, password=new_password)

    locked_user.set_password(new_password)
    locked_user.must_reset_password = False
    locked_user.save(update_fields=["password", "must_reset_password", "updated_at"])
    password_changed(new_password, locked_user)
    update_session_auth_hash(request, locked_user)

    return locked_user


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
