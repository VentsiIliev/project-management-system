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
            "can_edit": False,
            "can_delete": False,
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


def test_admin_can_edit_project_details():
    admin_user = create_user(
        email="project-edit-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project = create_project(owner=admin_user, code="EDT", name="Editable Project")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/projects/{project.id}",
        {
            "name": "Updated Project Name",
            "description": "Updated project description",
            "start_date": "2026-05-03",
            "end_date": "2026-06-03",
        },
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {
        "project": {
            "id": str(project.id),
            "name": "Updated Project Name",
            "code": "EDT",
            "description": "Updated project description",
            "owner_id": str(admin_user.id),
            "task_counter": 0,
            "start_date": "2026-05-03",
            "end_date": "2026-06-03",
            "can_edit": True,
            "can_delete": True,
        }
    }
    assert project.name == "Updated Project Name"
    assert project.description == "Updated project description"


def test_project_manager_can_edit_project_details():
    admin_user = create_user(
        email="project-edit-seed-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-edit-manager@example.com")
    project = create_project(owner=admin_user, code="PMG", name="Managed Project")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.patch(
        f"/api/projects/{project.id}",
        {
            "name": "Managed Project Updated",
        },
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 200
    assert response.json()["project"]["name"] == "Managed Project Updated"
    assert response.json()["project"]["can_edit"] is True
    assert response.json()["project"]["can_delete"] is True
    assert project.name == "Managed Project Updated"


def test_team_member_cannot_edit_project_details():
    admin_user = create_user(
        email="project-edit-member-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="project-edit-member@example.com")
    project = create_project(owner=admin_user, code="TMR", name="Team Member Readonly")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.patch(
        f"/api/projects/{project.id}",
        {
            "name": "Should Not Save",
        },
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to edit this project.",
            "details": {},
        }
    }
    assert project.name == "Team Member Readonly"


def test_project_update_rejects_invalid_date_range():
    admin_user = create_user(
        email="project-edit-dates-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project = create_project(owner=admin_user, code="DTR", name="Date Range Project")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/projects/{project.id}",
        {
            "start_date": "2026-06-03",
            "end_date": "2026-05-03",
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


def test_project_update_rejects_project_code_changes():
    admin_user = create_user(
        email="project-edit-code-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project = create_project(owner=admin_user, code="IMM", name="Immutable Code Project")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/projects/{project.id}",
        {
            "code": "NEW",
        },
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "PROJECT_CODE_IMMUTABLE",
            "message": "Project code cannot be changed.",
            "details": {
                "code": ["Project code cannot be changed."],
            },
        }
    }
    assert project.code == "IMM"


def test_project_delete_requires_confirmation():
    admin_user = create_user(
        email="project-delete-confirm-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project = create_project(owner=admin_user, code="DEL", name="Delete Me")
    client = APIClient()
    client.force_login(admin_user)

    response = client.delete(
        f"/api/projects/{project.id}",
        {},
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "confirm_project_delete": ["This field is required."],
            },
        }
    }
    assert project.deleted_at is None


def test_admin_can_soft_delete_a_project_and_its_memberships():
    admin_user = create_user(
        email="project-delete-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = create_user(email="project-delete-member@example.com")
    project = create_project(owner=admin_user, code="DELADM", name="Delete Admin Project")
    membership = create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    owner_membership = create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.delete(
        f"/api/projects/{project.id}",
        {"confirm_project_delete": True},
        format="json",
    )

    project.refresh_from_db()
    membership.refresh_from_db()
    owner_membership.refresh_from_db()

    assert response.status_code == 204
    assert project.deleted_at is not None
    assert membership.deleted_at is not None
    assert owner_membership.deleted_at is not None
    assert client.get("/api/projects").json() == {"projects": []}
    detail_response = client.get(f"/api/projects/{project.id}")
    assert detail_response.status_code == 404


def test_project_manager_can_delete_their_project():
    admin_user = create_user(
        email="project-delete-seed-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-delete-manager@example.com")
    project = create_project(owner=admin_user, code="PMD", name="Managed Delete")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.delete(
        f"/api/projects/{project.id}",
        {"confirm_project_delete": True},
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 204
    assert project.deleted_at is not None


def test_team_member_cannot_delete_a_project():
    admin_user = create_user(
        email="project-delete-member-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="project-delete-team-member@example.com")
    project = create_project(owner=admin_user, code="TMD", name="Member Delete Denied")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.delete(
        f"/api/projects/{project.id}",
        {"confirm_project_delete": True},
        format="json",
    )

    project.refresh_from_db()

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to delete this project.",
            "details": {},
        }
    }
    assert project.deleted_at is None


def test_deleted_projects_are_hidden_from_members_after_delete():
    admin_user = create_user(
        email="project-delete-hidden-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = create_user(email="project-delete-hidden-member@example.com")
    project = create_project(owner=admin_user, code="HDP", name="Hide Deleted Project")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(admin_user)
    client.delete(
        f"/api/projects/{project.id}",
        {"confirm_project_delete": True},
        format="json",
    )

    member_client = APIClient()
    member_client.force_login(member_user)

    list_response = member_client.get("/api/projects")
    detail_response = member_client.get(f"/api/projects/{project.id}")

    assert list_response.status_code == 200
    assert list_response.json() == {"projects": []}
    assert detail_response.status_code == 404
