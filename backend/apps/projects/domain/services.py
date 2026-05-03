from django.db import transaction
from django.utils import timezone

from apps.activity_logs.models import ActivityLogEvent
from apps.activity_logs.services import record_activity
from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project
from apps.projects.selectors import visible_projects_for_user

from .policies import can_create_project, can_delete_project, can_edit_project


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


class ProjectEditPermissionDeniedError(Exception):
    pass


class ProjectCodeImmutableError(Exception):
    pass


class ProjectDeletePermissionDeniedError(Exception):
    pass


def list_projects_for_actor(*, actor):
    return list(visible_projects_for_user(user=actor))


def get_project_for_actor(*, actor, project_id):
    project = visible_projects_for_user(user=actor).filter(id=project_id).first()
    if project is None:
        raise ProjectNotFoundError

    return project


@transaction.atomic
def update_project(
    *,
    actor,
    project_id,
    updates: dict,
):
    project = get_project_for_actor(actor=actor, project_id=project_id)

    if not can_edit_project(user=actor, project=project):
        raise ProjectEditPermissionDeniedError

    if "code" in updates:
        raise ProjectCodeImmutableError

    next_start_date = updates.get("start_date", project.start_date)
    next_end_date = updates.get("end_date", project.end_date)

    if next_start_date and next_end_date and next_end_date < next_start_date:
        raise InvalidProjectDateRangeError(
            {"end_date": ["End date cannot be earlier than start date."]}
        )

    if "name" in updates:
        project.name = updates["name"]
    if "description" in updates:
        project.description = updates["description"] or None
    if "start_date" in updates:
        project.start_date = updates["start_date"]
    if "end_date" in updates:
        project.end_date = updates["end_date"]

    project.save(
        update_fields=[
            "name",
            "description",
            "start_date",
            "end_date",
            "updated_at",
        ]
    )

    return project


@transaction.atomic
def delete_project(*, actor, project_id):
    project = get_project_for_actor(actor=actor, project_id=project_id)

    if not can_delete_project(user=actor, project=project):
        raise ProjectDeletePermissionDeniedError

    record_activity(
        event_type=ActivityLogEvent.PROJECT_DELETED,
        actor=actor,
        project=project,
        metadata={"project_code": project.code, "project_name": project.name},
    )

    deleted_at = timezone.now()
    ProjectMembership.all_objects.filter(
        project=project,
        deleted_at__isnull=True,
    ).update(
        deleted_at=deleted_at,
        updated_at=deleted_at,
    )
    project.deleted_at = deleted_at
    project.save(update_fields=["deleted_at", "updated_at"])


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
