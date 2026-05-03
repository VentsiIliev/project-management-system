from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.activity_logs.selectors import list_project_activity_for_actor, list_task_activity_for_actor
from apps.projects.api.views import error_response

from .serializers import ActivityLogSerializer


class TaskActivityListView(APIView):
    def get(self, request, task_id):
        task, entries = list_task_activity_for_actor(actor=request.user, task_id=task_id)
        if task is None:
            return error_response(
                code="TASK_NOT_FOUND",
                message="Task not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"activity": ActivityLogSerializer(entries, many=True).data},
            status=status.HTTP_200_OK,
        )


class ProjectActivityListView(APIView):
    def get(self, request, project_id):
        project, entries = list_project_activity_for_actor(actor=request.user, project_id=project_id)
        if project is None:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"activity": ActivityLogSerializer(entries, many=True).data},
            status=status.HTTP_200_OK,
        )
