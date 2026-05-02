from apps.memberships.models import ProjectMembership, ProjectMembershipRole


def can_create_project(*, user) -> bool:
    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()


def can_edit_project(*, user, project) -> bool:
    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    ).exists()
