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
            "can_manage_members": False,
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
            "can_manage_members": True,
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
    assert response.json()["project"]["can_manage_members"] is True
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


def test_visible_project_members_can_list_active_members():
    admin_user = create_user(
        email="project-members-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = create_user(email="project-members-member@example.com")
    project = create_project(owner=admin_user, code="MBR", name="Member Listing")
    create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/projects/{project.id}/members")

    assert response.status_code == 200
    assert response.json() == {
        "members": [
            {
                "user_id": str(admin_user.id),
                "email": admin_user.email,
                "name": admin_user.name,
                "is_active": True,
                "role": "PROJECT_MANAGER",
            },
            {
                "user_id": str(member_user.id),
                "email": member_user.email,
                "name": member_user.name,
                "is_active": True,
                "role": "TEAM_MEMBER",
            },
        ]
    }


def test_admin_can_add_project_member():
    admin_user = create_user(
        email="project-add-member-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-add-target@example.com")
    project = create_project(owner=admin_user, code="ADD", name="Add Member Project")
    create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(target_user.id),
            "role": "TEAM_MEMBER",
        },
        format="json",
    )

    membership = ProjectMembership.objects.get(project=project, user=target_user)

    assert response.status_code == 201
    assert response.json() == {
        "member": {
            "user_id": str(target_user.id),
            "email": target_user.email,
            "name": target_user.name,
            "is_active": True,
            "role": "TEAM_MEMBER",
        }
    }
    assert membership.role == ProjectMembershipRole.TEAM_MEMBER


def test_project_manager_can_add_project_member():
    admin_user = create_user(
        email="project-add-pm-seed@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-add-pm@example.com")
    target_user = create_user(email="project-add-pm-target@example.com")
    project = create_project(owner=admin_user, code="PMA", name="Project Manager Add")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(target_user.id),
            "role": "PROJECT_MANAGER",
        },
        format="json",
    )

    membership = ProjectMembership.objects.get(project=project, user=target_user)

    assert response.status_code == 201
    assert response.json()["member"]["role"] == "PROJECT_MANAGER"
    assert membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_team_member_cannot_add_project_member():
    admin_user = create_user(
        email="project-add-denied-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="project-add-denied-member@example.com")
    target_user = create_user(email="project-add-denied-target@example.com")
    project = create_project(owner=admin_user, code="NOM", name="Denied Add")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(target_user.id),
            "role": "TEAM_MEMBER",
        },
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to manage project members.",
            "details": {},
        }
    }
    assert ProjectMembership.objects.filter(project=project, user=target_user).exists() is False


def test_add_project_member_rejects_invalid_role():
    admin_user = create_user(
        email="project-add-role-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-add-role-target@example.com")
    project = create_project(owner=admin_user, code="ROL", name="Role Validation")
    create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(target_user.id),
            "role": "OBSERVER",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"
    assert "role" in response.json()["error"]["details"]


def test_add_project_member_rejects_inactive_users():
    admin_user = create_user(
        email="project-add-inactive-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    inactive_user = create_user(
        email="project-add-inactive-target@example.com",
        is_active=False,
    )
    project = create_project(owner=admin_user, code="INA", name="Inactive User Validation")
    create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(inactive_user.id),
            "role": "TEAM_MEMBER",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "user_id": ["The target user must be active."],
            },
        }
    }


def test_add_project_member_reactivates_a_soft_deleted_membership():
    admin_user = create_user(
        email="project-add-reactivate-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-add-reactivate-target@example.com")
    project = create_project(owner=admin_user, code="REA", name="Reactivate Member")
    create_membership(
        project=project,
        user=admin_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    membership = create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    membership.deleted_at = timezone.now()
    membership.save(update_fields=["deleted_at"])
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/members",
        {
            "user_id": str(target_user.id),
            "role": "PROJECT_MANAGER",
        },
        format="json",
    )

    membership.refresh_from_db()

    assert response.status_code == 201
    assert response.json()["member"]["role"] == "PROJECT_MANAGER"
    assert membership.deleted_at is None
    assert membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_admin_can_update_project_member_role():
    admin_user = create_user(
        email="project-member-update-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-member-update-target@example.com")
    project = create_project(owner=admin_user, code="UPD", name="Update Role")
    create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/projects/{project.id}/members/{target_user.id}",
        {"role": "PROJECT_MANAGER"},
        format="json",
    )

    membership = ProjectMembership.objects.get(project=project, user=target_user)

    assert response.status_code == 200
    assert response.json()["member"]["role"] == "PROJECT_MANAGER"
    assert membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_project_manager_can_update_project_member_role():
    admin_user = create_user(
        email="project-member-update-seed@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-member-update-pm@example.com")
    target_user = create_user(email="project-member-update-pm-target@example.com")
    project = create_project(owner=admin_user, code="PMU", name="PM Update Role")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.patch(
        f"/api/projects/{project.id}/members/{target_user.id}",
        {"role": "PROJECT_MANAGER"},
        format="json",
    )

    membership = ProjectMembership.objects.get(project=project, user=target_user)

    assert response.status_code == 200
    assert membership.role == ProjectMembershipRole.PROJECT_MANAGER


def test_team_member_cannot_update_project_member_role():
    admin_user = create_user(
        email="project-member-update-denied-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="project-member-update-denied@example.com")
    target_user = create_user(email="project-member-update-denied-target@example.com")
    project = create_project(owner=admin_user, code="NUP", name="No Update")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.patch(
        f"/api/projects/{project.id}/members/{target_user.id}",
        {"role": "PROJECT_MANAGER"},
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to manage project members.",
            "details": {},
        }
    }


def test_update_project_member_role_returns_not_found_for_missing_active_membership():
    admin_user = create_user(
        email="project-member-update-missing-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-member-update-missing-target@example.com")
    project = create_project(owner=admin_user, code="MIS", name="Missing Member")
    client = APIClient()
    client.force_login(admin_user)

    response = client.patch(
        f"/api/projects/{project.id}/members/{target_user.id}",
        {"role": "PROJECT_MANAGER"},
        format="json",
    )

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "PROJECT_MEMBER_NOT_FOUND",
            "message": "Project member not found.",
            "details": {},
        }
    }


def test_role_change_immediately_changes_project_management_permissions():
    admin_user = create_user(
        email="project-member-permissions-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-member-permissions-pm@example.com")
    target_user = create_user(email="project-member-permissions-target@example.com")
    project = create_project(owner=admin_user, code="PRM", name="Permission Change")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    downgrade_response = client.patch(
        f"/api/projects/{project.id}/members/{project_manager.id}",
        {"role": "TEAM_MEMBER"},
        format="json",
    )
    add_response = client.post(
        f"/api/projects/{project.id}/members",
        {
          "user_id": str(target_user.id),
          "role": "TEAM_MEMBER",
        },
        format="json",
    )
    detail_response = client.get(f"/api/projects/{project.id}")

    assert downgrade_response.status_code == 200
    assert add_response.status_code == 403
    assert detail_response.status_code == 200
    assert detail_response.json()["project"]["can_manage_members"] is False


def test_admin_can_remove_project_member():
    admin_user = create_user(
        email="project-member-remove-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-member-remove-target@example.com")
    project = create_project(owner=admin_user, code="REMV", name="Remove Member")
    membership = create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(admin_user)

    response = client.delete(f"/api/projects/{project.id}/members/{target_user.id}")

    membership.refresh_from_db()

    assert response.status_code == 204
    assert membership.deleted_at is not None


def test_project_manager_can_remove_project_member():
    admin_user = create_user(
        email="project-member-remove-seed@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    project_manager = create_user(email="project-member-remove-pm@example.com")
    target_user = create_user(email="project-member-remove-pm-target@example.com")
    project = create_project(owner=admin_user, code="RPM", name="Remove PM")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    membership = create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.delete(f"/api/projects/{project.id}/members/{target_user.id}")

    membership.refresh_from_db()

    assert response.status_code == 204
    assert membership.deleted_at is not None


def test_team_member_cannot_remove_project_member():
    admin_user = create_user(
        email="project-member-remove-denied-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    team_member = create_user(email="project-member-remove-denied@example.com")
    target_user = create_user(email="project-member-remove-denied-target@example.com")
    project = create_project(owner=admin_user, code="NRM", name="No Remove")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    membership = create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.delete(f"/api/projects/{project.id}/members/{target_user.id}")

    membership.refresh_from_db()

    assert response.status_code == 403
    assert membership.deleted_at is None


def test_remove_project_member_returns_not_found_for_missing_active_membership():
    admin_user = create_user(
        email="project-member-remove-missing-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-member-remove-missing-target@example.com")
    project = create_project(owner=admin_user, code="MRM", name="Missing Remove")
    client = APIClient()
    client.force_login(admin_user)

    response = client.delete(f"/api/projects/{project.id}/members/{target_user.id}")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "PROJECT_MEMBER_NOT_FOUND",
            "message": "Project member not found.",
            "details": {},
        }
    }


def test_removed_member_loses_project_access_immediately():
    admin_user = create_user(
        email="project-member-access-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    target_user = create_user(email="project-member-access-target@example.com")
    project = create_project(owner=admin_user, code="LSS", name="Lose Access")
    create_membership(
        project=project,
        user=target_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    admin_client = APIClient()
    admin_client.force_login(admin_user)
    admin_client.delete(f"/api/projects/{project.id}/members/{target_user.id}")

    target_client = APIClient()
    target_client.force_login(target_user)
    list_response = target_client.get("/api/projects")
    detail_response = target_client.get(f"/api/projects/{project.id}")
    members_response = target_client.get(f"/api/projects/{project.id}/members")

    assert list_response.status_code == 200
    assert list_response.json() == {"projects": []}
    assert detail_response.status_code == 404
    assert members_response.status_code == 404
