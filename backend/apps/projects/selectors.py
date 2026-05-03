from apps.projects.models import Project


def visible_projects_for_user(*, user):
    if (
        not user
        or not user.is_authenticated
        or not user.is_active
        or user.deleted_at is not None
        or user.must_reset_password
    ):
        return Project.objects.none()

    if user.is_admin:
        return Project.objects.all()

    return Project.objects.filter(
        memberships__user=user,
        memberships__deleted_at__isnull=True,
    ).distinct()
