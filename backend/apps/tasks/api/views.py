from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tasks.domain.services import (
    UNSET,
    change_task_status,
    create_task,
    delete_task,
    get_task_for_actor,
    list_task_dependencies,
    list_my_tasks_for_actor,
    InvalidTaskAssigneeError,
    InvalidTaskDependencyError,
    InvalidTaskCollaboratorError,
    InvalidTaskDateRangeError,
    InvalidTaskHierarchyError,
    InvalidTaskParentError,
    InvalidTaskPriorityError,
    InvalidTaskStatusTransitionError,
    list_tasks_for_actor,
    add_task_dependency,
    remove_task_dependency,
    CrossProjectTaskDependencyError,
    DuplicateTaskDependencyError,
    SubtasksIncompleteError,
    TaskNotFoundError,
    TaskBlockedError,
    TaskCascadeConfirmationRequiredError,
    TaskCreatePermissionDeniedError,
    TaskDependencyCycleError,
    TaskDependencyNotFoundError,
    TaskDependencyPermissionDeniedError,
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
    AddTaskDependencySerializer,
    MyTaskListQuerySerializer,
    TaskDependencySummarySerializer,
    TaskListQuerySerializer,
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
        serializer = TaskListQuerySerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            _, tasks, pagination = list_tasks_for_actor(
                actor=request.user,
                project_id=project_id,
                search=serializer.validated_data.get("search"),
                status_id=serializer.validated_data.get("status_id"),
                priority_id=serializer.validated_data.get("priority_id"),
                assignee_id=serializer.validated_data.get("assignee_id"),
                deadline_from=serializer.validated_data.get("deadline_from"),
                deadline_to=serializer.validated_data.get("deadline_to"),
                is_blocked=serializer.validated_data.get("is_blocked"),
                page=serializer.validated_data["page"],
                page_size=serializer.validated_data["page_size"],
            )
        except TaskProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"tasks": TaskSerializer(tasks, many=True).data, "pagination": pagination},
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


class TaskListView(APIView):
    def get(self, request):
        serializer = MyTaskListQuerySerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        tasks, pagination = list_my_tasks_for_actor(
            actor=request.user,
            include_collaborator_tasks=serializer.validated_data["include_collaborator_tasks"],
            sort_by=serializer.validated_data["sort_by"],
            page=serializer.validated_data["page"],
            page_size=serializer.validated_data["page_size"],
        )
        return Response(
            {"tasks": TaskSerializer(tasks, many=True).data, "pagination": pagination},
            status=status.HTTP_200_OK,
        )


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
        except SubtasksIncompleteError:
            return error_response(
                code="SUBTASKS_INCOMPLETE",
                message="Parent tasks cannot be completed while active subtasks remain incomplete.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except TaskBlockedError:
            return error_response(
                code="TASK_BLOCKED",
                message="Blocked tasks cannot move forward until all dependencies are complete.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"task": TaskSerializer(task).data}, status=status.HTTP_200_OK)


class TaskDependencyListCreateView(APIView):
    def get(self, request, task_id):
        try:
            dependencies = list_task_dependencies(actor=request.user, task_id=task_id)
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"dependencies": TaskDependencySummarySerializer(dependencies, many=True).data},
            status=status.HTTP_200_OK,
        )

    def post(self, request, task_id):
        serializer = AddTaskDependencySerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            task = add_task_dependency(
                actor=request.user,
                task_id=task_id,
                depends_on_task_id=serializer.validated_data["depends_on_task_id"],
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskDependencyPermissionDeniedError:
            return error_response(
                code="TASK_PERMISSION_DENIED",
                message="You do not have permission to manage task dependencies.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except InvalidTaskDependencyError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except CrossProjectTaskDependencyError:
            return error_response(
                code="CROSS_PROJECT_DEPENDENCY",
                message="Task dependencies must stay within the same project.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except DuplicateTaskDependencyError:
            return error_response(
                code="DUPLICATE_DEPENDENCY",
                message="This dependency already exists.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except TaskDependencyCycleError:
            return error_response(
                code="DEPENDENCY_CYCLE",
                message="This dependency would create a circular dependency.",
                details={},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"task": TaskSerializer(task).data}, status=status.HTTP_200_OK)


class TaskDependencyDetailView(APIView):
    def delete(self, request, task_id, depends_on_task_id):
        try:
            task = remove_task_dependency(
                actor=request.user,
                task_id=task_id,
                depends_on_task_id=depends_on_task_id,
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except TaskDependencyPermissionDeniedError:
            return error_response(
                code="TASK_PERMISSION_DENIED",
                message="You do not have permission to manage task dependencies.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except TaskDependencyNotFoundError:
            return error_response(
                code="DEPENDENCY_NOT_FOUND",
                message="Task dependency not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
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
