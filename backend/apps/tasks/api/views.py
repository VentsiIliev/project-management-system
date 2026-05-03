from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tasks.domain.services import (
    UNSET,
    change_task_status,
    create_task,
    delete_task,
    get_task_for_actor,
    InvalidTaskAssigneeError,
    InvalidTaskCollaboratorError,
    InvalidTaskDateRangeError,
    InvalidTaskHierarchyError,
    InvalidTaskParentError,
    InvalidTaskPriorityError,
    InvalidTaskStatusTransitionError,
    list_tasks_for_actor,
    TaskNotFoundError,
    TaskCascadeConfirmationRequiredError,
    TaskCreatePermissionDeniedError,
    TaskDeletePermissionDeniedError,
    TaskOptimisticLockError,
    TaskProjectNotFoundError,
    TaskStatusChangePermissionDeniedError,
    TaskUpdatePermissionDeniedError,
    update_task,
)
from apps.tasks.selectors import (
    list_task_priorities,
    list_task_status_transitions,
    list_task_workflow_statuses,
)

from .serializers import (
    ChangeTaskStatusSerializer,
    CreateTaskSerializer,
    DeleteTaskSerializer,
    TaskPrioritySerializer,
    TaskSerializer,
    TaskStatusSerializer,
    TaskStatusTransitionSerializer,
    UpdateTaskSerializer,
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
                collaborator_ids=serializer.validated_data.get("collaborator_ids"),
                parent_task_id=serializer.validated_data.get("parent_task_id"),
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
        except InvalidTaskCollaboratorError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidTaskParentError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidTaskHierarchyError:
            return error_response(
                code="INVALID_HIERARCHY",
                message="Subtasks cannot have their own children.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"task": TaskSerializer(task).data},
            status=status.HTTP_201_CREATED,
        )


class TaskDetailView(APIView):
    def get(self, request, task_id):
        try:
            task = get_task_for_actor(actor=request.user, task_id=task_id)
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response({"task": TaskSerializer(task).data}, status=status.HTTP_200_OK)

    def patch(self, request, task_id):
        serializer = UpdateTaskSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            task = update_task(
                actor=request.user,
                task_id=task_id,
                version=serializer.validated_data["version"],
                title=serializer.validated_data.get("title", UNSET),
                description=serializer.validated_data.get("description", UNSET),
                priority_id=serializer.validated_data.get("priority_id", UNSET),
                start_date=serializer.validated_data.get("start_date", UNSET),
                deadline=serializer.validated_data.get("deadline", UNSET),
                primary_assignee_id=serializer.validated_data.get(
                    "primary_assignee_id", UNSET
                ),
                collaborator_ids=serializer.validated_data.get("collaborator_ids", UNSET),
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskUpdatePermissionDeniedError:
            return error_response(
                code="TASK_PERMISSION_DENIED",
                message="You do not have permission to update this task.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except TaskOptimisticLockError as exc:
            return error_response(
                code="OPTIMISTIC_LOCK_FAILED",
                message="Task was modified by another user. Please refresh and try again.",
                details={"current_version": exc.current_version},
                status_code=status.HTTP_409_CONFLICT,
            )
        except (
            InvalidTaskDateRangeError,
            InvalidTaskAssigneeError,
            InvalidTaskPriorityError,
            InvalidTaskCollaboratorError,
        ) as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"task": TaskSerializer(task).data}, status=status.HTTP_200_OK)

    def delete(self, request, task_id):
        serializer = DeleteTaskSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            delete_task(
                actor=request.user,
                task_id=task_id,
                confirm_cascade_subtasks=serializer.validated_data["confirm_cascade_subtasks"],
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskDeletePermissionDeniedError:
            return error_response(
                code="TASK_PERMISSION_DENIED",
                message="You do not have permission to delete this task.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except TaskCascadeConfirmationRequiredError:
            return error_response(
                code="CASCADE_CONFIRMATION_REQUIRED",
                message="Deleting this parent task requires confirmation to cascade to its subtasks.",
                details={
                    "confirm_cascade_subtasks": [
                        "This task has subtasks. Confirm cascade deletion to continue."
                    ]
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskStatusUpdateView(APIView):
    def post(self, request, task_id):
        serializer = ChangeTaskStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            task = change_task_status(
                actor=request.user,
                task_id=task_id,
                to_status_id=serializer.validated_data["to_status_id"],
                version=serializer.validated_data["version"],
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskStatusChangePermissionDeniedError:
            return error_response(
                code="TASK_PERMISSION_DENIED",
                message="You do not have permission to change task status.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except TaskOptimisticLockError as exc:
            return error_response(
                code="OPTIMISTIC_LOCK_FAILED",
                message="Task was modified by another user. Please refresh and try again.",
                details={"current_version": exc.current_version},
                status_code=status.HTTP_409_CONFLICT,
            )
        except InvalidTaskStatusTransitionError:
            return error_response(
                code="INVALID_STATUS_TRANSITION",
                message="The requested status transition is not allowed.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"task": TaskSerializer(task).data}, status=status.HTTP_200_OK)


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
