import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from rest_framework.test import APIClient

from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project


pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def clear_project_rate_limit_cache():
    cache.clear()


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


def test_project_create_requires_a_valid_csrf_token():
    admin_user = create_user(
        email="csrf-project-create@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient(enforce_csrf_checks=True)
    client.force_login(admin_user)

    response = client.post(
        "/api/projects",
        {
            "name": "Blocked By Csrf",
            "code": "CSRF",
        },
        format="json",
    )

    assert response.status_code == 403


def test_project_create_succeeds_with_a_valid_csrf_token():
    admin_user = create_user(
        email="csrf-project-create-success@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    client = APIClient(enforce_csrf_checks=True)
    client.force_login(admin_user)
    csrf_response = client.get("/api/auth/me")
    csrf_token = csrf_response.cookies["csrftoken"].value

    response = client.post(
        "/api/projects",
        {
            "name": "Allowed By Csrf",
            "code": "safe",
        },
        format="json",
        HTTP_X_CSRFTOKEN=csrf_token,
    )

    assert response.status_code == 201


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


def test_project_list_only_returns_projects_visible_to_the_member():
    admin_user = create_user(
        email="projects-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = create_user(email="member.visible@example.com")
    visible_project = create_project(
        owner=admin_user,
        code="VIS",
        name="Visible Project",
    )
    hidden_project = create_project(
        owner=admin_user,
        code="HID",
        name="Hidden Project",
    )
    create_membership(
        project=visible_project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get("/api/projects")

    assert response.status_code == 200
    assert response.json() == {
        "projects": [
            {
                "id": str(visible_project.id),
                "name": "Visible Project",
                "code": "VIS",
                "description": None,
                "owner_id": str(admin_user.id),
                "task_counter": 0,
                "start_date": None,
                "end_date": None,
            }
        ]
    }
    assert str(hidden_project.id) not in str(response.json())


def test_admin_project_list_returns_all_active_projects():
    admin_user = create_user(
        email="all-projects-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    first_project = create_project(owner=admin_user, code="ALP", name="Alpha Project")
    second_project = create_project(owner=admin_user, code="BET", name="Beta Project")
    client = APIClient()
    client.force_login(admin_user)

    response = client.get("/api/projects")

    assert response.status_code == 200
    assert response.json() == {
        "projects": [
            {
                "id": str(first_project.id),
                "name": "Alpha Project",
                "code": "ALP",
                "description": None,
                "owner_id": str(admin_user.id),
                "task_counter": 0,
                "start_date": None,
                "end_date": None,
            },
            {
                "id": str(second_project.id),
                "name": "Beta Project",
                "code": "BET",
                "description": None,
                "owner_id": str(admin_user.id),
                "task_counter": 0,
                "start_date": None,
                "end_date": None,
            },
        ]
    }


def test_active_project_member_can_view_project_details():
    admin_user = create_user(
        email="detail-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = create_user(email="detail-member@example.com")
    project = create_project(owner=admin_user, code="DET", name="Detail Project")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/projects/{project.id}")

    assert response.status_code == 200
    assert response.json() == {
        "project": {
            "id": str(project.id),
            "name": "Detail Project",
            "code": "DET",
            "description": None,
            "owner_id": str(admin_user.id),
            "task_counter": 0,
            "start_date": None,
            "end_date": None,
        }
    }


def test_non_member_cannot_view_project_details():
    admin_user = create_user(
        email="non-member-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    outsider_user = create_user(email="outsider@example.com")
    project = create_project(owner=admin_user, code="DEN", name="Denied Project")
    client = APIClient()
    client.force_login(outsider_user)

    response = client.get(f"/api/projects/{project.id}")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "PROJECT_NOT_FOUND",
            "message": "Project not found.",
            "details": {},
        }
    }


def test_removed_member_cannot_view_project_details():
    admin_user = create_user(
        email="removed-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    removed_user = create_user(email="removed@example.com")
    project = create_project(owner=admin_user, code="REM", name="Removed Project")
    membership = create_membership(
        project=project,
        user=removed_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    membership.deleted_at = timezone.now()
    membership.save(update_fields=["deleted_at"])
    client = APIClient()
    client.force_login(removed_user)

    response = client.get(f"/api/projects/{project.id}")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "PROJECT_NOT_FOUND",
            "message": "Project not found.",
            "details": {},
        }
    }
