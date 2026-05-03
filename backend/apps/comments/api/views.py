from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.comments.selectors import list_comments_for_actor
from apps.comments.services import InvalidCommentError, create_comment, serialize_comment
from apps.tasks.api.views import error_response
from apps.tasks.domain.services import TaskNotFoundError

from .serializers import CommentListSerializer, CreateCommentSerializer


class TaskCommentListCreateView(APIView):
    def get(self, request, task_id):
        serializer = CommentListSerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        task, comments = list_comments_for_actor(
            actor=request.user,
            task_id=task_id,
            since_comment_id=serializer.validated_data.get("since_comment_id"),
        )
        if task is None:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if comments is None:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details={"since_comment_id": ["The reference comment must belong to the same task."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"comments": [serialize_comment(comment) for comment in comments]},
            status=status.HTTP_200_OK,
        )

    def post(self, request, task_id):
        serializer = CreateCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            comment = create_comment(
                actor=request.user,
                task_id=task_id,
                content=serializer.validated_data["content"],
            )
        except TaskNotFoundError:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except InvalidCommentError as exc:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"comment": serialize_comment(comment)}, status=status.HTTP_201_CREATED)
