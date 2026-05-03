from apps.memberships.models import ProjectMembership, ProjectMembershipRole


def _is_active_authorized_user(user) -> bool:
    return bool(
        user
        and user.is_authenticated
        and user.is_active
        and user.deleted_at is None
        and not user.must_reset_password
    )


def _active_membership(user, project):
    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        deleted_at__isnull=True,
    ).first()


def can_create_task(*, user, project) -> bool:
    if not _is_active_authorized_user(user):
        return False

    if user.is_admin:
        return True

    membership = _active_membership(user, project)
    return bool(membership and membership.role == ProjectMembershipRole.PROJECT_MANAGER)


def can_update_task_planning(*, user, project) -> bool:
    if not _is_active_authorized_user(user):
        return False

    if user.is_admin:
        return True

    membership = _active_membership(user, project)
    return bool(membership and membership.role == ProjectMembershipRole.PROJECT_MANAGER)


def can_delete_task(*, user, project) -> bool:
    return can_update_task_planning(user=user, project=project)


def can_manage_task_dependencies(*, user, project) -> bool:
    return can_update_task_planning(user=user, project=project)


def can_update_task_description(*, user, project) -> bool:
    if (
        not _is_active_authorized_user(user)
    ):
        return False

    if user.is_admin:
        return True

    return ProjectMembership.objects.filter(
        project=project,
        user=user,
        deleted_at__isnull=True,
    ).exists()


def can_change_task_status(*, user, project) -> bool:
    return can_update_task_description(user=user, project=project)
