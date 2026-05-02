from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tasks.domain.services import (
    create_task,
    InvalidTaskAssigneeError,
    InvalidTaskDateRangeError,
    list_tasks_for_actor,
    TaskCreatePermissionDeniedError,
    TaskProjectNotFoundError,
)

from .serializers import CreateTaskSerializer, TaskSerializer


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


class ProjectTaskListCreateView(APIView):
    def get(self, request, project_id):
        try:
            _, tasks = list_tasks_for_actor(actor=request.user, project_id=project_id)
        except TaskProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"tasks": TaskSerializer(tasks, many=True).data},
            status=status.HTTP_200_OK,
        )

    def post(self, request, project_id):
        serializer = CreateTaskSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            task = create_task(
                actor=request.user,
                project_id=project_id,
                title=serializer.validated_data["title"],
                description=serializer.validated_data.get("description"),
                start_date=serializer.validated_data.get("start_date"),
                deadline=serializer.validated_data.get("deadline"),
                primary_assignee_id=serializer.validated_data.get("primary_assignee_id"),
            )
        except TaskProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskCreatePermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to create tasks in this project.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except InvalidTaskDateRangeError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidTaskAssigneeError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"task": TaskSerializer(task).data},
            status=status.HTTP_201_CREATED,
        )
