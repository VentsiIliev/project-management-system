import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project
from apps.tasks.models import (
    Task,
    TaskPriority,
    TaskPriorityName,
    TaskStatusName,
    TaskWorkflowStatus,
)


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


def get_status(name: str) -> TaskWorkflowStatus:
    return TaskWorkflowStatus.objects.get(name=name)


def get_priority(name: str) -> TaskPriority:
    return TaskPriority.objects.get(name=name)


def serialize_status(status: TaskWorkflowStatus):
    return {
        "id": str(status.id),
        "name": status.name,
        "sort_order": status.sort_order,
        "is_final": status.is_final,
        "is_active": status.is_active,
        "color": status.color,
    }


def serialize_priority(priority: TaskPriority | None):
    if priority is None:
        return None

    return {
        "id": str(priority.id),
        "name": priority.name,
        "sort_order": priority.sort_order,
        "is_active": priority.is_active,
        "color": priority.color,
    }


def create_task(
    *,
    project,
    created_by,
    title="Initial task",
    assignee=None,
    status_name=TaskStatusName.TODO,
    priority_name=None,
):
    project.task_counter += 1
    project.save(update_fields=["task_counter", "updated_at"])
    return Task.all_objects.create(
        project=project,
        task_number=project.task_counter,
        task_key=f"{project.code}-{project.task_counter}",
        title=title,
        status=get_status(status_name),
        priority=get_priority(priority_name) if priority_name else None,
        primary_assignee=assignee,
        created_by=created_by,
    )


def test_visible_project_member_can_list_project_tasks():
    admin_user = create_user(
        email="task-list-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-list-member@example.com")
    project = create_project(owner=admin_user, code="TSK", name="Task Project")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(
        project=project,
        created_by=admin_user,
        assignee=member_user,
        priority_name=TaskPriorityName.HIGH,
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/projects/{project.id}/tasks")

    assert response.status_code == 200
    assert response.json() == {
        "tasks": [
            {
                "id": str(task.id),
                "task_key": "TSK-1",
                "title": "Initial task",
                "description": None,
                "status": serialize_status(task.status),
                "priority": serialize_priority(task.priority),
                "primary_assignee": {
                    "id": str(member_user.id),
                    "name": member_user.name,
                },
                "start_date": None,
                "deadline": None,
                "version": 1,
                "created_at": task.created_at.isoformat().replace("+00:00", "Z"),
            }
        ]
    }


def test_non_member_cannot_list_project_tasks():
    admin_user = create_user(
        email="task-list-hidden-admin@example.com",
        is_admin=True,
    )
    outsider_user = create_user(email="task-list-outsider@example.com")
    project = create_project(owner=admin_user, code="HID", name="Hidden Tasks")
    client = APIClient()
    client.force_login(outsider_user)

    response = client.get(f"/api/projects/{project.id}/tasks")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "PROJECT_NOT_FOUND",
            "message": "Project not found.",
            "details": {},
        }
    }


def test_admin_can_create_a_task_with_default_todo_status_and_priority():
    admin_user = create_user(
        email="task-create-admin@example.com",
        is_admin=True,
    )
    assignee = create_user(email="task-create-assignee@example.com")
    project = create_project(owner=admin_user, code="ENG", name="Engineering")
    create_membership(
        project=project,
        user=assignee,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    high_priority = get_priority(TaskPriorityName.HIGH)
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Implement login",
            "description": "Add authentication flow",
            "priority_id": str(high_priority.id),
            "start_date": "2026-05-01",
            "deadline": "2026-05-05",
            "primary_assignee_id": str(assignee.id),
        },
        format="json",
    )

    task = Task.objects.get(project=project, task_number=1)
    project.refresh_from_db()

    assert response.status_code == 201
    assert response.json() == {
        "task": {
            "id": str(task.id),
            "task_key": "ENG-1",
            "title": "Implement login",
            "description": "Add authentication flow",
            "status": serialize_status(task.status),
            "priority": serialize_priority(task.priority),
            "primary_assignee": {
                "id": str(assignee.id),
                "name": assignee.name,
            },
            "start_date": "2026-05-01",
            "deadline": "2026-05-05",
            "version": 1,
            "created_at": task.created_at.isoformat().replace("+00:00", "Z"),
        }
    }
    assert task.status.name == TaskStatusName.TODO
    assert task.priority_id == high_priority.id
    assert task.task_key == "ENG-1"
    assert project.task_counter == 1


def test_project_manager_can_create_a_task():
    admin_user = create_user(
        email="task-create-seed-admin@example.com",
        is_admin=True,
    )
    project_manager = create_user(email="task-create-manager@example.com")
    project = create_project(owner=admin_user, code="PMG", name="Project Managed")
    create_membership(
        project=project,
        user=project_manager,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    client = APIClient()
    client.force_login(project_manager)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Plan rollout",
        },
        format="json",
    )

    task = Task.objects.get(project=project, task_number=1)

    assert response.status_code == 201
    assert task.created_by_id == project_manager.id


def test_team_member_cannot_create_a_task():
    admin_user = create_user(
        email="task-create-denied-admin@example.com",
        is_admin=True,
    )
    team_member = create_user(email="task-create-denied-member@example.com")
    project = create_project(owner=admin_user, code="NOC", name="No Create")
    create_membership(
        project=project,
        user=team_member,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    client = APIClient()
    client.force_login(team_member)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Blocked task",
        },
        format="json",
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "PROJECT_PERMISSION_DENIED",
            "message": "You do not have permission to create tasks in this project.",
            "details": {},
        }
    }
    assert Task.objects.filter(project=project).exists() is False


def test_create_task_rejects_assignee_who_is_not_an_active_project_member():
    admin_user = create_user(
        email="task-create-member-check-admin@example.com",
        is_admin=True,
    )
    non_member = create_user(email="task-create-member-check@example.com")
    project = create_project(owner=admin_user, code="MEM", name="Membership Guard")
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Guard assignment",
            "primary_assignee_id": str(non_member.id),
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "primary_assignee_id": ["The assignee must be an active project member."],
            },
        }
    }
    assert Task.objects.filter(project=project).exists() is False


def test_create_task_rejects_inactive_priority():
    admin_user = create_user(
        email="task-create-priority-admin@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="PRI", name="Priority Guard")
    priority = get_priority(TaskPriorityName.URGENT)
    priority.is_active = False
    priority.save(update_fields=["is_active", "updated_at"])
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Guard priority",
            "priority_id": str(priority.id),
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "priority_id": ["Inactive priorities cannot be assigned to new tasks."],
            },
        }
    }
    assert Task.objects.filter(project=project).exists() is False


def test_create_task_rejects_invalid_date_range():
    admin_user = create_user(
        email="task-create-dates-admin@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="DUE", name="Due Dates")
    client = APIClient()
    client.force_login(admin_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Bad dates",
            "start_date": "2026-05-05",
            "deadline": "2026-05-01",
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "deadline": ["Deadline cannot be earlier than start date."],
            },
        }
    }


def test_workflow_metadata_endpoints_return_seeded_statuses_transitions_and_priorities():
    user = create_user(
        email="task-metadata-admin@example.com",
        is_admin=True,
    )
    client = APIClient()
    client.force_login(user)

    statuses_response = client.get("/api/task-statuses")
    transitions_response = client.get("/api/task-status-transitions")
    priorities_response = client.get("/api/task-priorities")

    assert statuses_response.status_code == 200
    assert [status["name"] for status in statuses_response.json()["statuses"]] == [
        TaskStatusName.TODO,
        TaskStatusName.IN_PROGRESS,
        TaskStatusName.DONE,
    ]
    assert any(
        transition["from_status_id"] and transition["to_status_id"]
        for transition in transitions_response.json()["transitions"]
    )
    assert [priority["name"] for priority in priorities_response.json()["priorities"]] == [
        TaskPriorityName.LOW,
        TaskPriorityName.MEDIUM,
        TaskPriorityName.HIGH,
        TaskPriorityName.URGENT,
    ]
