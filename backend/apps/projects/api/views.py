from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.domain.services import (
    create_project,
    DuplicateProjectCodeError,
    InvalidProjectDateRangeError,
    ProjectCreatePermissionDeniedError,
)

from .serializers import CreateProjectSerializer, ProjectSerializer


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
class ProjectListCreateView(APIView):
    def post(self, request):
        serializer = CreateProjectSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            project = create_project(
                actor=request.user,
                name=serializer.validated_data["name"],
                code=serializer.validated_data["code"],
                description=serializer.validated_data.get("description"),
                start_date=serializer.validated_data.get("start_date"),
                end_date=serializer.validated_data.get("end_date"),
            )
        except ProjectCreatePermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to create projects.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except InvalidProjectDateRangeError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except DuplicateProjectCodeError:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details={"code": ["A project with this code already exists."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"project": ProjectSerializer(project).data},
            status=status.HTTP_201_CREATED,
        )
