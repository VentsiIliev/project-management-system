from apps.memberships.models import ProjectMembership, ProjectMembershipRole


def can_create_task(*, user, project) -> bool:
    if (
        not user
        or not user.is_authenticated
        or not user.is_active
        or user.deleted_at is not None
        or user.must_reset_password
    ):
        return False

    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()
