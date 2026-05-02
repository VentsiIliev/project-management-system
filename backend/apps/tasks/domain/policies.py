from apps.memberships.models import ProjectMembership, ProjectMembershipRole


def can_create_task(*, user, project) -> bool:
    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()
