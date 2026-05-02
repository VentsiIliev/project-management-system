from apps.projects.models import Project


def visible_projects_for_user(*, user):
    if user.is_admin:
        return Project.objects.all()

    return Project.objects.filter(
        memberships__user=user,
        memberships__deleted_at__isnull=True,
    ).distinct()
