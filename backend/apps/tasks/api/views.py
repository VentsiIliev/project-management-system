from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tasks.domain.services import (
    create_task,
    InvalidTaskAssigneeError,
    InvalidTaskDateRangeError,
    InvalidTaskPriorityError,
    list_tasks_for_actor,
    TaskCreatePermissionDeniedError,
    TaskProjectNotFoundError,
)
from apps.tasks.selectors import (
    list_task_priorities,
    list_task_status_transitions,
    list_task_workflow_statuses,
)

from .serializers import (
    CreateTaskSerializer,
    TaskPrioritySerializer,
    TaskSerializer,
    TaskStatusSerializer,
    TaskStatusTransitionSerializer,
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
                priority_id=serializer.validated_data.get("priority_id"),
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
        except InvalidTaskPriorityError as exc:
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


class WorkflowMetadataView(APIView):
    def get(self, request):
        return Response(
            {
                "statuses": TaskStatusSerializer(list_task_workflow_statuses(), many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class TaskStatusTransitionListView(APIView):
    def get(self, request):
        transitions = list_task_status_transitions()
        payload = [
            {
                "id": transition.id,
                "name": transition.name,
                "is_active": transition.is_active,
                "from_status_id": transition.from_status_id,
                "to_status_id": transition.to_status_id,
            }
            for transition in transitions
        ]
        return Response(
            {
                "transitions": TaskStatusTransitionSerializer(payload, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class TaskPriorityListView(APIView):
    def get(self, request):
        return Response(
            {
                "priorities": TaskPrioritySerializer(list_task_priorities(), many=True).data,
            },
            status=status.HTTP_200_OK,
        )
