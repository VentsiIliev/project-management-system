import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project


pytestmark = pytest.mark.django_db


def create_user(**overrides):
    user_model = get_user_model()
    password = overrides.pop("password", "valid-password")
    defaults = {
        "email": "user@example.com",
        "name": "Jane Doe",
        "must_reset_password": False,
    }
    defaults.update(overrides)
    return user_model.objects.create_user(password=password, **defaults)


def create_project(*, owner, code="BASE", name="Base Project"):
    return Project.all_objects.create(
        owner=owner,
        code=code,
        name=name,
    )


def create_membership(*, project, user, role):
    return ProjectMembership.all_objects.create(
        project=project,
        user=user,
        role=role,
    )


def test_admin_can_create_a_project():
    admin_user = create_user(
        email="admin.project@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/projects",
        {
            "name": "Engineering Platform",
            "code": "eng",
            "description": "Internal engineering work",
            "start_date": "2026-05-01",
            "end_date": "2026-06-01",
        },
        format="json",
    )

    created_project = Project.all_objects.get(code="ENG")
    creator_membership = ProjectMembership.all_objects.get(
        project=created_project,
        user=admin_user,
    )

    assert response.status_code == 201
    assert response.json() == {
        "project": {
            "id": str(created_project.id),
            "name": "Engineering Platform",
            "code": "ENG",
            "description": "Internal engineering work",
            "owner_id": str(admin_user.id),
            "task_counter": 0,
            "start_date": "2026-05-01",
            "end_date": "2026-06-01",
        }
    }
    assert created_project.owner_id == admin_user.id
    assert creator_membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_project_manager_can_create_a_project():
    admin_user = create_user(
        email="admin.seed@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="manager@example.com")
    existing_project = create_project(owner=admin_user, code="OPS", name="Operations")
    create_membership(
        project=existing_project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.post(
        "/api/projects",
        {
            "name": "Delivery Platform",
            "code": "dlv",
        },
        format="json",
    )

    created_project = Project.all_objects.get(code="DLV")
    creator_membership = ProjectMembership.all_objects.get(
        project=created_project,
        user=project_manager,
    )

    assert response.status_code == 201
    assert created_project.owner_id == project_manager.id
    assert creator_membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_create_project_rejects_an_invalid_date_range():
    admin_user = create_user(
        email="admin.dates@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/projects",
        {
            "name": "Invalid Dates",
            "code": "DATE",
            "start_date": "2026-06-01",
            "end_date": "2026-05-01",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "end_date": ["End date cannot be earlier than start date."],
            },
        }
    }
    assert Project.all_objects.filter(code="DATE").exists() is False


def test_create_project_rejects_a_duplicate_code():
    admin_user = create_user(
        email="admin.duplicate-project@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    create_project(owner=admin_user, code="ENG", name="Existing")
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        "/api/projects",
        {
            "name": "Existing Code",
            "code": "eng",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "code": ["A project with this code already exists."],
            },
        }
    }


def test_team_members_cannot_create_projects():
    admin_user = create_user(
        email="admin.member-project@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="member.project@example.com")
    existing_project = create_project(owner=admin_user, code="TEAM", name="Team Project")
    create_membership(
        project=existing_project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.post(
        "/api/projects",
        {
            "name": "Blocked Project",
            "code": "BLK",
        },
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to create projects.",
            "details": {},
        }
    }
    assert Project.all_objects.filter(code="BLK").exists() is False
