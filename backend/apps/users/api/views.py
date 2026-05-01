from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.domain.services import (
    InvalidCredentialsError,
    authenticate_user_session,
    get_active_session_user,
    serialize_session_user,
)

from .serializers import LoginSerializer, SessionUserSerializer


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
