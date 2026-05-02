from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.domain.services import (
    create_project,
    delete_project,
    DuplicateProjectCodeError,
    get_project_for_actor,
    InvalidProjectDateRangeError,
    list_projects_for_actor,
    ProjectNotFoundError,
    ProjectCodeImmutableError,
    ProjectCreatePermissionDeniedError,
    ProjectDeletePermissionDeniedError,
    ProjectEditPermissionDeniedError,
    update_project,
)

from .serializers import (
    CreateProjectSerializer,
    DeleteProjectSerializer,
    ProjectDetailSerializer,
    ProjectSerializer,
    UpdateProjectSerializer,
)


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
    def get(self, request):
        projects = list_projects_for_actor(actor=request.user)
        return Response(
            {"projects": ProjectSerializer(projects, many=True).data},
            status=status.HTTP_200_OK,
        )

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


class ProjectDetailView(APIView):
    def get(self, request, project_id):
        try:
            project = get_project_for_actor(actor=request.user, project_id=project_id)
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"project": ProjectDetailSerializer(project, context={"user": request.user}).data},
            status=status.HTTP_200_OK,
        )

    def patch(self, request, project_id):
        serializer = UpdateProjectSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            project = update_project(
                actor=request.user,
                project_id=project_id,
                updates=serializer.validated_data,
            )
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ProjectEditPermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to edit this project.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except ProjectCodeImmutableError:
            return error_response(
                code="PROJECT_CODE_IMMUTABLE",
                message="Project code cannot be changed.",
                details={"code": ["Project code cannot be changed."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidProjectDateRangeError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"project": ProjectDetailSerializer(project, context={"user": request.user}).data},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, project_id):
        serializer = DeleteProjectSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            delete_project(
                actor=request.user,
                project_id=project_id,
            )
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ProjectDeletePermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to delete this project.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
