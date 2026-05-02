from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.api.views import error_response
from apps.projects.domain.services import ProjectNotFoundError

from ..domain.services import (
    add_project_member,
    InactiveProjectMembershipUserError,
    list_project_members_for_actor,
    ProjectMemberAlreadyExistsError,
    ProjectMemberNotFoundError,
    ProjectMemberPermissionDeniedError,
    ProjectMembershipUserNotFoundError,
    remove_project_member,
    update_project_member_role,
)
from .serializers import AddProjectMemberSerializer, ProjectMemberSerializer, UpdateProjectMemberSerializer


@method_decorator(csrf_protect, name="dispatch")
class ProjectMemberListCreateView(APIView):
    def get(self, request, project_id):
        try:
            memberships = list_project_members_for_actor(
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

        return Response(
            {"members": ProjectMemberSerializer(memberships, many=True).data},
            status=status.HTTP_200_OK,
        )

    def post(self, request, project_id):
        serializer = AddProjectMemberSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            membership = add_project_member(
                actor=request.user,
                project_id=project_id,
                user_id=serializer.validated_data["user_id"],
                role=serializer.validated_data["role"],
            )
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ProjectMemberPermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to manage project members.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except ProjectMembershipUserNotFoundError:
            return error_response(
                code="USER_NOT_FOUND",
                message="User not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except InactiveProjectMembershipUserError:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details={"user_id": ["The target user must be active."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except ProjectMemberAlreadyExistsError:
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details={"user_id": ["This user is already an active project member."]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"member": ProjectMemberSerializer(membership).data},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_protect, name="dispatch")
class ProjectMemberDetailView(APIView):
    def patch(self, request, project_id, user_id):
        serializer = UpdateProjectMemberSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            membership = update_project_member_role(
                actor=request.user,
                project_id=project_id,
                user_id=user_id,
                role=serializer.validated_data["role"],
            )
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ProjectMemberPermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to manage project members.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except ProjectMemberNotFoundError:
            return error_response(
                code="PROJECT_MEMBER_NOT_FOUND",
                message="Project member not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"member": ProjectMemberSerializer(membership).data},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, project_id, user_id):
        try:
            remove_project_member(
                actor=request.user,
                project_id=project_id,
                user_id=user_id,
            )
        except ProjectNotFoundError:
            return error_response(
                code="PROJECT_NOT_FOUND",
                message="Project not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ProjectMemberPermissionDeniedError:
            return error_response(
                code="PROJECT_PERMISSION_DENIED",
                message="You do not have permission to manage project members.",
                details={},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        except ProjectMemberNotFoundError:
            return error_response(
                code="PROJECT_MEMBER_NOT_FOUND",
                message="Project member not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
