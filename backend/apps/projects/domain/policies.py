from apps.memberships.models import ProjectMembership, ProjectMembershipRole


def _is_active_authorized_user(user) -> bool:
    return bool(
        user
        and user.is_authenticated
        and user.is_active
        and user.deleted_at is None
        and not user.must_reset_password
    )


def can_create_project(*, user) -> bool:
    if not _is_active_authorized_user(user):
        return False

    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()


def can_edit_project(*, user, project) -> bool:
    if not _is_active_authorized_user(user):
        return False

    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()


def can_delete_project(*, user, project) -> bool:
    return can_edit_project(user=user, project=project)
