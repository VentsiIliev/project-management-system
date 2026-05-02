from django.db import transaction

from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project
from apps.projects.selectors import visible_projects_for_user

from .policies import can_create_project


class ProjectCreatePermissionDeniedError(Exception):
    pass


class DuplicateProjectCodeError(Exception):
    pass


class InvalidProjectDateRangeError(Exception):
    def __init__(self, details: dict[str, list[str]]):
        super().__init__("Invalid project date range.")
        self.details = details


class ProjectNotFoundError(Exception):
    pass


def list_projects_for_actor(*, actor):
    return list(visible_projects_for_user(user=actor))


def get_project_for_actor(*, actor, project_id):
    project = visible_projects_for_user(user=actor).filter(id=project_id).first()
    if project is None:
        raise ProjectNotFoundError

    return project


@transaction.atomic
def create_project(
    *,
    actor,
    name: str,
    code: str,
    description: str | None = None,
    start_date=None,
    end_date=None,
):
    if not can_create_project(user=actor):
        raise ProjectCreatePermissionDeniedError

    normalized_code = code.strip().upper()

    if start_date and end_date and end_date < start_date:
        raise InvalidProjectDateRangeError(
            {"end_date": ["End date cannot be earlier than start date."]}
        )

    if Project.all_objects.filter(code__iexact=normalized_code).exists():
        raise DuplicateProjectCodeError

    project = Project.all_objects.create(
        name=name,
        code=normalized_code,
        description=description or None,
        owner=actor,
        start_date=start_date,
        end_date=end_date,
    )
    ProjectMembership.all_objects.create(
        project=project,
        user=actor,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )

    return project
