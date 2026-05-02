from django.contrib.auth import get_user_model
from django.db import transaction

from apps.memberships.models import ProjectMembership
from apps.projects.domain.policies import can_edit_project
from apps.projects.domain.services import get_project_for_actor


class ProjectMemberPermissionDeniedError(Exception):
    pass


class ProjectMembershipUserNotFoundError(Exception):
    pass


class InactiveProjectMembershipUserError(Exception):
    pass


class ProjectMemberAlreadyExistsError(Exception):
    pass


def list_project_members_for_actor(*, actor, project_id):
    project = get_project_for_actor(actor=actor, project_id=project_id)
    return list(
        ProjectMembership.objects.select_related("user")
        .filter(project=project)
        .order_by("user__name", "user__email")
    )


@transaction.atomic
def add_project_member(*, actor, project_id, user_id, role):
    project = get_project_for_actor(actor=actor, project_id=project_id)

    if not can_edit_project(user=actor, project=project):
        raise ProjectMemberPermissionDeniedError

    user_model = get_user_model()
    target_user = (
        user_model.all_objects.select_for_update()
        .filter(pk=user_id, deleted_at__isnull=True)
        .first()
    )
    if target_user is None:
        raise ProjectMembershipUserNotFoundError

    if not target_user.is_active:
        raise InactiveProjectMembershipUserError

    existing_membership = (
        ProjectMembership.all_objects.select_for_update()
        .filter(project=project, user=target_user)
        .first()
    )

    if existing_membership is not None:
        if existing_membership.deleted_at is None:
            raise ProjectMemberAlreadyExistsError

        existing_membership.role = role
        existing_membership.deleted_at = None
        existing_membership.save(update_fields=["role", "deleted_at", "updated_at"])
        return existing_membership

    return ProjectMembership.all_objects.create(
        project=project,
        user=target_user,
        role=role,
    )
