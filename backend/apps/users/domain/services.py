from dataclasses import dataclass
from importlib import import_module

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
from django.core.cache import cache
from django.db import transaction
from django.contrib.sessions.models import Session
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


class AuthenticationRateLimitedError(Exception):
    def __init__(self, retry_after: int):
        super().__init__("Authentication rate limit exceeded.")
        self.retry_after = retry_after


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


def get_client_ip(*, request) -> str:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR", "unknown")


def _rate_limit_key(*, scope: str, identifier: str) -> str:
    return f"auth-rate-limit:{scope}:{identifier}"


def _record_failed_attempt(*, scope: str, identifier: str) -> bool:
    max_attempts = settings.AUTH_RATE_LIMIT_MAX_ATTEMPTS
    window_seconds = settings.AUTH_RATE_LIMIT_WINDOW_SECONDS
    key = _rate_limit_key(scope=scope, identifier=identifier)
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, timeout=window_seconds)
    return attempts > max_attempts


def _is_rate_limited(*, scope: str, identifier: str) -> bool:
    return cache.get(_rate_limit_key(scope=scope, identifier=identifier), 0) >= (
        settings.AUTH_RATE_LIMIT_MAX_ATTEMPTS
    )


def _clear_rate_limit(*, scope: str, identifier: str) -> None:
    cache.delete(_rate_limit_key(scope=scope, identifier=identifier))


def ensure_login_not_rate_limited(*, request, email: str) -> None:
    normalized_email = get_user_model().objects.normalize_email(email).lower()
    client_ip = get_client_ip(request=request)
    scoped_identifiers = (
        _rate_limit_key(scope="login:ip", identifier=client_ip),
        _rate_limit_key(scope="login:email", identifier=normalized_email),
    )

    if any(cache.get(identifier, 0) >= settings.AUTH_RATE_LIMIT_MAX_ATTEMPTS for identifier in scoped_identifiers):
        raise AuthenticationRateLimitedError(settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)


def record_failed_login_attempt(*, request, email: str) -> None:
    normalized_email = get_user_model().objects.normalize_email(email).lower()
    client_ip = get_client_ip(request=request)
    ip_limited = _record_failed_attempt(scope="login:ip", identifier=client_ip)
    email_limited = _record_failed_attempt(scope="login:email", identifier=normalized_email)

    if ip_limited or email_limited:
        raise AuthenticationRateLimitedError(settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)


def clear_login_rate_limit(*, request, email: str) -> None:
    normalized_email = get_user_model().objects.normalize_email(email).lower()
    client_ip = get_client_ip(request=request)
    _clear_rate_limit(scope="login:ip", identifier=client_ip)
    _clear_rate_limit(scope="login:email", identifier=normalized_email)


def ensure_force_reset_not_rate_limited(*, request, user) -> None:
    client_ip = get_client_ip(request=request)
    user_identifier = str(user.pk)

    if (
        _is_rate_limited(scope="force-reset:ip", identifier=client_ip)
        or _is_rate_limited(scope="force-reset:user", identifier=user_identifier)
    ):
        raise AuthenticationRateLimitedError(settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)


def record_failed_force_reset_attempt(*, request, user) -> None:
    client_ip = get_client_ip(request=request)
    user_identifier = str(user.pk)
    ip_limited = _record_failed_attempt(scope="force-reset:ip", identifier=client_ip)
    user_limited = _record_failed_attempt(scope="force-reset:user", identifier=user_identifier)

    if ip_limited or user_limited:
        raise AuthenticationRateLimitedError(settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)


def clear_force_reset_rate_limit(*, request, user) -> None:
    client_ip = get_client_ip(request=request)
    user_identifier = str(user.pk)
    _clear_rate_limit(scope="force-reset:ip", identifier=client_ip)
    _clear_rate_limit(scope="force-reset:user", identifier=user_identifier)


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


def preserve_existing_user_sessions(*, user) -> None:
    session_hash = user.get_session_auth_hash()
    session_user_id = str(user.pk)
    session_store_class = import_module(settings.SESSION_ENGINE).SessionStore

    for session in Session.objects.filter(expire_date__gt=timezone.now()):
        session_data = session.get_decoded()
        if session_data.get("_auth_user_id") != session_user_id:
            continue

        session_data["_auth_user_hash"] = session_hash
        session.session_data = session_store_class().encode(session_data)
        session.save(update_fields=["session_data", "expire_date"])


def revoke_existing_user_sessions(*, user) -> None:
    session_user_id = str(user.pk)
    active_sessions = Session.objects.filter(expire_date__gt=timezone.now())
    sessions_to_delete = []

    for session in active_sessions:
        session_data = session.get_decoded()
        if session_data.get("_auth_user_id") == session_user_id:
            sessions_to_delete.append(session.pk)

    if sessions_to_delete:
        Session.objects.filter(pk__in=sessions_to_delete).delete()


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
    should_revoke_sessions = False

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
        should_revoke_sessions = user.is_active and not is_active
        user.is_active = is_active
        update_fields.append("is_active")

    if update_fields:
        user.save(update_fields=[*update_fields, "updated_at"])

    if should_revoke_sessions:
        revoke_existing_user_sessions(user=user)

    return user


@transaction.atomic
def admin_reset_user_password(*, actor, user_id, new_temporary_password: str):
    user_model = get_user_model()
    user = (
        user_model.all_objects.select_for_update()
        .filter(pk=user_id, deleted_at__isnull=True)
        .first()
    )

    if user is None:
        raise UserNotFoundError

    validate_user_password(
        user=user,
        password=new_temporary_password,
        field_name="new_temporary_password",
    )

    user.set_password(new_temporary_password)
    user.must_reset_password = True
    user.save(update_fields=["password", "must_reset_password", "updated_at"])
    password_changed(new_temporary_password, user)
    preserve_existing_user_sessions(user=user)

    return user


@transaction.atomic
def force_reset_password(*, request, user, new_password: str):
    ensure_force_reset_not_rate_limited(request=request, user=user)
    locked_user = user.__class__.all_objects.select_for_update().get(pk=user.pk)

    if locked_user.deleted_at is not None or not locked_user.is_active:
        django_logout(request)
        return None

    if not locked_user.must_reset_password:
        record_failed_force_reset_attempt(request=request, user=locked_user)
        raise PasswordResetNotRequiredError

    try:
        validate_user_password(user=locked_user, password=new_password)
    except PasswordValidationFailedError:
        record_failed_force_reset_attempt(request=request, user=locked_user)
        raise

    locked_user.set_password(new_password)
    locked_user.must_reset_password = False
    locked_user.save(update_fields=["password", "must_reset_password", "updated_at"])
    password_changed(new_password, locked_user)
    update_session_auth_hash(request, locked_user)
    clear_force_reset_rate_limit(request=request, user=locked_user)

    return locked_user


@transaction.atomic
def authenticate_user_session(*, request, email: str, password: str) -> AuthenticatedSession:
    user_model = get_user_model()
    normalized_email = user_model.objects.normalize_email(email).lower()
    ensure_login_not_rate_limited(request=request, email=normalized_email)
    user = (
        user_model.all_objects.select_for_update()
        .filter(email__iexact=normalized_email)
        .first()
    )

    if user is None or user.deleted_at is not None or not user.is_active:
        record_failed_login_attempt(request=request, email=normalized_email)
        raise InvalidCredentialsError

    if not user.check_password(password):
        record_failed_login_attempt(request=request, email=normalized_email)
        raise InvalidCredentialsError

    user.last_login_at = timezone.now()
    user.save(update_fields=["last_login_at", "updated_at"])
    django_login(request, user, backend=settings.AUTHENTICATION_BACKENDS[0])
    clear_login_rate_limit(request=request, email=normalized_email)

    return AuthenticatedSession(
        user=user,
        requires_password_reset=user.must_reset_password,
    )
