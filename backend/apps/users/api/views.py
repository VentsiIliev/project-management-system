from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.domain.services import (
    create_user_account,
    DuplicateEmailError,
    InvalidCredentialsError,
    authenticate_user_session,
    force_reset_password,
    get_active_session_user,
    logout_user_session,
    PasswordResetNotRequiredError,
    PasswordValidationFailedError,
    serialize_session_user,
)

from .serializers import (
    AdminUserSerializer,
    CreateUserSerializer,
    ForceResetPasswordSerializer,
    LoginSerializer,
    SessionUserSerializer,
)
from .permissions import IsAdminUser


def error_response(*, code: str, message: str, details: dict, status_code: int) -> Response:
    return Response(
        {
            "error": {
                "code": code,
                "message": message,
                "details": details,
            }
        },
        status=status_code,
    )


@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            session = authenticate_user_session(
                request=request,
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except InvalidCredentialsError:
            return error_response(
                code="INVALID_CREDENTIALS",
                message="Invalid email or password.",
                details={},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        user_data = SessionUserSerializer(serialize_session_user(session.user)).data
        return Response(
            {
                "user": user_data,
                "requires_password_reset": session.requires_password_reset,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CurrentUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        session_user = get_active_session_user(request)
        if session_user is None:
            return error_response(
                code="UNAUTHENTICATED",
                message="Authentication required.",
                details={},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = SessionUserSerializer(serialize_session_user(session_user))
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_protect, name="dispatch")
class ForceResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        session_user = get_active_session_user(request)
        if session_user is None:
            return error_response(
                code="UNAUTHENTICATED",
                message="Authentication required.",
                details={},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = ForceResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated_user = force_reset_password(
                request=request,
                user=session_user,
                new_password=serializer.validated_data["new_password"],
            )
        except PasswordValidationFailedError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except PasswordResetNotRequiredError:
            return error_response(
                code="PASSWORD_RESET_NOT_REQUIRED",
                message="Password reset is not required for this user.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )

        if updated_user is None:
            return error_response(
                code="UNAUTHENTICATED",
                message="Authentication required.",
                details={},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        user_data = SessionUserSerializer(serialize_session_user(updated_user)).data
        return Response(
            {
                "user": user_data,
                "requires_password_reset": False,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not logout_user_session(request=request):
            return error_response(
                code="UNAUTHENTICATED",
                message="Authentication required.",
                details={},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_protect, name="dispatch")
class AdminUserListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            created_user = create_user_account(
                actor=request.user,
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                temporary_password=serializer.validated_data["temporary_password"],
                is_active=serializer.validated_data["is_active"],
            )
        except DuplicateEmailError:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details={"email": ["A user with this email already exists."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except PasswordValidationFailedError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user_data = AdminUserSerializer(created_user).data
        return Response({"user": user_data}, status=status.HTTP_201_CREATED)
