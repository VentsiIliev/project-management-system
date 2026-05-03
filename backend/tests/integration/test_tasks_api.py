from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from threading import Barrier

import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError, close_old_connections
from django.utils import timezone
from rest_framework.test import APIClient

from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.projects.models import Project
from apps.tasks.domain.services import create_task as create_task_service
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
    status, _ = TaskWorkflowStatus.objects.get_or_create(
        name=name,
        defaults={
            "sort_order": 1,
            "is_final": name == TaskStatusName.DONE,
            "is_active": True,
        },
    )
    return status


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
    collaborators=None,
    status_name=TaskStatusName.TODO,
    priority_name=None,
    deadline=None,
    parent_task=None,
):
    project.task_counter += 1
    project.save(update_fields=["task_counter", "updated_at"])
    task = Task.all_objects.create(
        project=project,
        task_number=project.task_counter,
        task_key=f"{project.code}-{project.task_counter}",
        title=title,
        status=get_status(status_name),
        priority=get_priority(priority_name) if priority_name else None,
        primary_assignee=assignee,
        parent_task=parent_task,
        created_by=created_by,
        deadline=deadline,
    )
    if collaborators:
        task.collaborators.set(collaborators)

    return task


def serialize_task(task: Task):
    return {
        "id": str(task.id),
        "task_key": task.task_key,
        "project_id": str(task.project_id),
        "parent_task_id": str(task.parent_task_id) if task.parent_task_id else None,
        "title": task.title,
        "description": task.description,
        "status": serialize_status(task.status),
        "priority": serialize_priority(task.priority),
        "primary_assignee": (
            {
                "id": str(task.primary_assignee_id),
                "name": task.primary_assignee.name,
            }
            if task.primary_assignee
            else None
        ),
        "collaborators": [
            {"id": str(collaborator.id), "name": collaborator.name}
            for collaborator in sorted(task.collaborators.all(), key=lambda user: (user.name, str(user.id)))
        ],
        "is_blocked": False,
        "is_overdue": bool(task.deadline and not task.status.is_final and task.deadline < timezone.localdate()),
        "start_date": task.start_date.isoformat() if task.start_date else None,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "version": task.version,
        "created_at": task.created_at.isoformat().replace("+00:00", "Z"),
        "subtasks": [
            serialize_task(subtask)
            for subtask in task.subtasks.select_related("status", "priority", "primary_assignee")
            .prefetch_related("collaborators")
            .order_by("task_number")
        ],
        "dependencies": [],
    }


@pytest.mark.django_db(transaction=True)
def test_task_numbers_are_generated_atomically_per_project():
    admin_user = create_user(
        email="task-atomic-admin@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="ATM", name="Atomic Numbering")
    start_barrier = Barrier(2)

    def create_concurrent_task(title: str):
        close_old_connections()
        start_barrier.wait()
        task = create_task_service(
            actor=admin_user,
            project_id=project.id,
            title=title,
        )
        close_old_connections()
        return task.task_number, task.task_key

    with ThreadPoolExecutor(max_workers=2) as executor:
        left = executor.submit(create_concurrent_task, "Concurrent Task A")
        right = executor.submit(create_concurrent_task, "Concurrent Task B")
        created = [left.result(), right.result()]

    project.refresh_from_db()
    persisted_numbers = list(
        Task.objects.filter(project=project).order_by("task_number").values_list("task_number", flat=True)
    )
    persisted_keys = list(
        Task.objects.filter(project=project).order_by("task_number").values_list("task_key", flat=True)
    )

    assert sorted(number for number, _ in created) == [1, 2]
    assert persisted_numbers == [1, 2]
    assert persisted_keys == ["ATM-1", "ATM-2"]
    assert project.task_counter == 2


@pytest.mark.django_db(transaction=True)
def test_task_requires_exactly_one_project():
    admin_user = create_user(
        email="task-project-required-admin@example.com",
        is_admin=True,
    )
    status = get_status(TaskStatusName.TODO)

    with pytest.raises(IntegrityError):
        Task.all_objects.create(
            task_number=1,
            task_key="NOPROJECT-1",
            title="Missing project",
            status=status,
            created_by=admin_user,
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
    assert response.json() == {"tasks": [serialize_task(task)]}


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


def test_visible_project_member_can_view_task_detail():
    admin_user = create_user(
        email="task-detail-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-detail-member@example.com")
    collaborator = create_user(email="task-detail-collaborator@example.com")
    project = create_project(owner=admin_user, code="DTL", name="Task Detail")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    create_membership(
        project=project,
        user=collaborator,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(
        project=project,
        created_by=admin_user,
        assignee=member_user,
        collaborators=[collaborator],
        priority_name=TaskPriorityName.HIGH,
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/tasks/{task.id}")

    assert response.status_code == 200
    assert response.json() == {"task": serialize_task(task)}


def test_task_detail_includes_active_subtasks_only():
    admin_user = create_user(
        email="task-detail-subtasks-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-detail-subtasks-member@example.com")
    project = create_project(owner=admin_user, code="SUBD", name="Subtask Detail")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    parent_task = create_task(project=project, created_by=admin_user, title="Parent task")
    visible_subtask = create_task(
        project=project,
        created_by=admin_user,
        title="Visible subtask",
        parent_task=parent_task,
    )
    deleted_subtask = create_task(
        project=project,
        created_by=admin_user,
        title="Deleted subtask",
        parent_task=parent_task,
    )
    deleted_subtask.deleted_at = timezone.now()
    deleted_subtask.save(update_fields=["deleted_at", "updated_at"])
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/tasks/{parent_task.id}")

    assert response.status_code == 200
    assert response.json()["task"]["subtasks"] == [serialize_task(visible_subtask)]


def test_non_member_cannot_view_task_detail():
    admin_user = create_user(
        email="task-detail-hidden-admin@example.com",
        is_admin=True,
    )
    outsider_user = create_user(email="task-detail-outsider@example.com")
    project = create_project(owner=admin_user, code="HDT", name="Hidden Task Detail")
    task = create_task(project=project, created_by=admin_user)
    client = APIClient()
    client.force_login(outsider_user)

    response = client.get(f"/api/tasks/{task.id}")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "TASK_NOT_FOUND",
            "message": "Task not found.",
            "details": {},
        }
    }


def test_soft_deleted_task_is_hidden_from_task_detail():
    admin_user = create_user(
        email="task-detail-deleted-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-detail-deleted-member@example.com")
    project = create_project(owner=admin_user, code="DEL", name="Deleted Task Detail")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user)
    task.deleted_at = timezone.now()
    task.save(update_fields=["deleted_at", "updated_at"])
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/tasks/{task.id}")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "TASK_NOT_FOUND",
            "message": "Task not found.",
            "details": {},
        }
    }


def test_task_endpoints_require_authentication():
    admin_user = create_user(
        email="task-auth-required-admin@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="TAR", name="Task Auth Required")
    client = APIClient()

    list_response = client.get(f"/api/projects/{project.id}/tasks")
    create_response = client.post(
        f"/api/projects/{project.id}/tasks",
        {"title": "Denied"},
        format="json",
    )
    statuses_response = client.get("/api/task-statuses")
    transitions_response = client.get("/api/task-status-transitions")
    priorities_response = client.get("/api/task-priorities")

    for response in [
        list_response,
        create_response,
        statuses_response,
        transitions_response,
        priorities_response,
    ]:
        assert response.status_code == 403
        assert response.json() == {"detail": "Authentication credentials were not provided."}


def test_inactive_user_cannot_access_task_endpoints():
    inactive_user = create_user(
        email="inactive-task-user@example.com",
        is_active=False,
        must_reset_password=False,
    )
    admin_user = create_user(
        email="inactive-task-owner@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="ITA", name="Inactive Task Access")
    client = APIClient()
    client.force_login(inactive_user)

    list_response = client.get(f"/api/projects/{project.id}/tasks")
    create_response = client.post(
        f"/api/projects/{project.id}/tasks",
        {"title": "Denied"},
        format="json",
    )
    metadata_response = client.get("/api/task-statuses")

    assert list_response.status_code == 403
    assert list_response.json() == {"detail": "Authentication credentials were not provided."}
    assert create_response.status_code == 403
    assert create_response.json() == {"detail": "Authentication credentials were not provided."}
    assert metadata_response.status_code == 403
    assert metadata_response.json() == {"detail": "Authentication credentials were not provided."}


def test_reset_required_user_cannot_access_task_endpoints():
    reset_required_user = create_user(
        email="reset-task-user@example.com",
        must_reset_password=True,
    )
    admin_user = create_user(
        email="reset-task-owner@example.com",
        is_admin=True,
    )
    project = create_project(owner=admin_user, code="RTA", name="Reset Task Access")
    client = APIClient()
    client.force_login(reset_required_user)

    list_response = client.get(f"/api/projects/{project.id}/tasks")
    create_response = client.post(
        f"/api/projects/{project.id}/tasks",
        {"title": "Denied"},
        format="json",
    )
    metadata_response = client.get("/api/task-priorities")

    assert list_response.status_code == 403
    assert list_response.json() == {"detail": "Password reset required."}
    assert create_response.status_code == 403
    assert create_response.json() == {"detail": "Password reset required."}
    assert metadata_response.status_code == 403
    assert metadata_response.json() == {"detail": "Password reset required."}


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
    assert response.json() == {"task": serialize_task(task)}
    assert task.status.name == TaskStatusName.TODO
    assert task.priority_id == high_priority.id
    assert task.task_key == "ENG-1"
    assert project.task_counter == 1
    assert task.project_id == project.id


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


def test_project_manager_can_create_subtask_for_root_task():
    admin_user = create_user(
        email="subtask-create-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="subtask-create-manager@example.com")
    project = create_project(owner=admin_user, code="SUB", name="Subtasks")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    parent_task = create_task(project=project, created_by=admin_user, title="Parent task")
    client = APIClient()
    client.force_login(manager_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Child task",
            "parent_task_id": str(parent_task.id),
        },
        format="json",
    )

    created_task = Task.objects.get(project=project, task_number=2)

    assert response.status_code == 201
    assert response.json() == {"task": serialize_task(created_task)}
    assert created_task.parent_task_id == parent_task.id


def test_create_subtask_rejects_parent_from_another_project():
    admin_user = create_user(
        email="subtask-parent-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="subtask-parent-manager@example.com")
    project = create_project(owner=admin_user, code="SAM", name="Same Project")
    other_project = create_project(owner=admin_user, code="OTH", name="Other Project")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    foreign_parent = create_task(project=other_project, created_by=admin_user, title="Foreign parent")
    client = APIClient()
    client.force_login(manager_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Rejected child",
            "parent_task_id": str(foreign_parent.id),
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "parent_task_id": ["The parent task must belong to the same active project."],
            },
        }
    }


def test_create_subtask_rejects_parent_that_is_already_a_subtask():
    admin_user = create_user(
        email="subtask-depth-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="subtask-depth-manager@example.com")
    project = create_project(owner=admin_user, code="DEP", name="Hierarchy")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    parent_task = create_task(project=project, created_by=admin_user, title="Parent")
    subtask = create_task(
        project=project,
        created_by=admin_user,
        title="Child",
        parent_task=parent_task,
    )
    client = APIClient()
    client.force_login(manager_user)

    response = client.post(
        f"/api/projects/{project.id}/tasks",
        {
            "title": "Grandchild",
            "parent_task_id": str(subtask.id),
        },
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "INVALID_HIERARCHY",
            "message": "Subtasks cannot have their own children.",
            "details": {},
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


def test_project_manager_can_update_task_planning_fields_and_collaborators():
    admin_user = create_user(
        email="task-update-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-update-manager@example.com")
    assignee = create_user(email="task-update-assignee@example.com")
    collaborator = create_user(email="task-update-collaborator@example.com")
    project = create_project(owner=admin_user, code="UPD", name="Task Update")
    for member, role in [
        (manager_user, ProjectMembershipRole.PROJECT_MANAGER),
        (assignee, ProjectMembershipRole.TEAM_MEMBER),
        (collaborator, ProjectMembershipRole.TEAM_MEMBER),
    ]:
        create_membership(project=project, user=member, role=role)
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(manager_user)
    priority = get_priority(TaskPriorityName.HIGH)

    response = client.patch(
        f"/api/tasks/{task.id}",
        {
            "title": "Updated title",
            "description": "Updated description",
            "priority_id": str(priority.id),
            "start_date": "2026-05-02",
            "deadline": "2026-05-07",
            "primary_assignee_id": str(assignee.id),
            "collaborator_ids": [str(collaborator.id)],
            "version": 1,
        },
        format="json",
    )

    task.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {"task": serialize_task(task)}
    assert task.title == "Updated title"
    assert task.description == "Updated description"
    assert task.priority_id == priority.id
    assert task.primary_assignee_id == assignee.id
    assert task.version == 2
    assert list(task.collaborators.values_list("id", flat=True)) == [collaborator.id]


def test_team_member_can_update_task_description_only():
    admin_user = create_user(
        email="task-update-description-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-update-description-member@example.com")
    project = create_project(owner=admin_user, code="DSC", name="Task Description")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(member_user)

    response = client.patch(
        f"/api/tasks/{task.id}",
        {"description": "Execution notes", "version": 1},
        format="json",
    )

    task.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {"task": serialize_task(task)}
    assert task.description == "Execution notes"
    assert task.title == "Initial title"
    assert task.version == 2


def test_team_member_cannot_update_task_planning_fields():
    admin_user = create_user(
        email="task-update-planning-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-update-planning-member@example.com")
    project = create_project(owner=admin_user, code="PLN", name="Task Planning")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(member_user)

    response = client.patch(
        f"/api/tasks/{task.id}",
        {"title": "Forbidden title", "version": 1},
        format="json",
    )

    task.refresh_from_db()

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "TASK_PERMISSION_DENIED",
            "message": "You do not have permission to update this task.",
            "details": {},
        }
    }
    assert task.title == "Initial title"
    assert task.version == 1


def test_task_update_rejects_stale_version():
    admin_user = create_user(
        email="task-update-lock-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-update-lock-manager@example.com")
    project = create_project(owner=admin_user, code="LCK", name="Task Lock")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    task.version = 3
    task.save(update_fields=["version", "updated_at"])
    client = APIClient()
    client.force_login(manager_user)

    response = client.patch(
        f"/api/tasks/{task.id}",
        {"description": "Conflicting change", "version": 2},
        format="json",
    )

    assert response.status_code == 409
    assert response.json() == {
        "error": {
            "code": "OPTIMISTIC_LOCK_FAILED",
            "message": "Task was modified by another user. Please refresh and try again.",
            "details": {"current_version": 3},
        }
    }


def test_task_update_rejects_collaborator_who_is_not_active_project_member():
    admin_user = create_user(
        email="task-update-collab-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-update-collab-manager@example.com")
    outsider = create_user(email="task-update-collab-outsider@example.com")
    project = create_project(owner=admin_user, code="COL", name="Task Collaborators")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(manager_user)

    response = client.patch(
        f"/api/tasks/{task.id}",
        {"collaborator_ids": [str(outsider.id)], "version": 1},
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {
                "collaborator_ids": ["Collaborators must be active project members."],
            },
        }
    }


def test_project_manager_can_delete_task_without_subtasks():
    admin_user = create_user(
        email="task-delete-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-delete-manager@example.com")
    project = create_project(owner=admin_user, code="TDL", name="Task Delete")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    task = create_task(project=project, created_by=admin_user, title="Disposable")
    client = APIClient()
    client.force_login(manager_user)

    response = client.delete(f"/api/tasks/{task.id}", format="json")

    task.refresh_from_db()

    assert response.status_code == 204
    assert task.deleted_at is not None


def test_delete_task_requires_cascade_confirmation_when_subtasks_exist():
    admin_user = create_user(
        email="task-delete-confirm-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-delete-confirm-manager@example.com")
    project = create_project(owner=admin_user, code="CFM", name="Cascade Confirm")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    parent_task = create_task(project=project, created_by=admin_user, title="Parent task")
    create_task(
        project=project,
        created_by=admin_user,
        title="Child task",
        parent_task=parent_task,
    )
    client = APIClient()
    client.force_login(manager_user)

    response = client.delete(f"/api/tasks/{parent_task.id}", format="json")

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "CASCADE_CONFIRMATION_REQUIRED",
            "message": "Deleting this parent task requires confirmation to cascade to its subtasks.",
            "details": {
                "confirm_cascade_subtasks": [
                    "This task has subtasks. Confirm cascade deletion to continue."
                ]
            },
        }
    }


def test_delete_task_cascades_to_active_subtasks_with_confirmation():
    admin_user = create_user(
        email="task-delete-cascade-admin@example.com",
        is_admin=True,
    )
    manager_user = create_user(email="task-delete-cascade-manager@example.com")
    project = create_project(owner=admin_user, code="CAS", name="Cascade Delete")
    create_membership(
        project=project,
        user=manager_user,
        role=ProjectMembershipRole.PROJECT_MANAGER,
    )
    parent_task = create_task(project=project, created_by=admin_user, title="Parent task")
    child_task = create_task(
        project=project,
        created_by=admin_user,
        title="Child task",
        parent_task=parent_task,
    )
    client = APIClient()
    client.force_login(manager_user)

    response = client.delete(
        f"/api/tasks/{parent_task.id}",
        {"confirm_cascade_subtasks": True},
        format="json",
    )

    parent_task.refresh_from_db()
    child_task.refresh_from_db()

    assert response.status_code == 204
    assert parent_task.deleted_at is not None
    assert child_task.deleted_at is not None


def test_team_member_cannot_delete_task():
    admin_user = create_user(
        email="task-delete-denied-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-delete-denied-member@example.com")
    project = create_project(owner=admin_user, code="DEN", name="Delete Denied")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user, title="Protected task")
    client = APIClient()
    client.force_login(member_user)

    response = client.delete(f"/api/tasks/{task.id}", format="json")

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "TASK_PERMISSION_DENIED",
            "message": "You do not have permission to delete this task.",
            "details": {},
        }
    }
    task.refresh_from_db()
    assert task.deleted_at is None


def test_soft_deleted_task_is_hidden_from_project_task_list():
    admin_user = create_user(
        email="task-list-deleted-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-list-deleted-member@example.com")
    project = create_project(owner=admin_user, code="HIDT", name="Hidden Tasks")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    visible_task = create_task(project=project, created_by=admin_user, title="Visible")
    deleted_task = create_task(project=project, created_by=admin_user, title="Deleted")
    deleted_task.deleted_at = timezone.now()
    deleted_task.save(update_fields=["deleted_at", "updated_at"])
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/projects/{project.id}/tasks")

    assert response.status_code == 200
    assert response.json() == {"tasks": [serialize_task(visible_task)]}


def test_project_member_can_change_task_status():
    admin_user = create_user(
        email="task-status-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-status-member@example.com")
    project = create_project(owner=admin_user, code="STS", name="Task Status")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(member_user)
    to_status = get_status(TaskStatusName.IN_PROGRESS)

    response = client.post(
        f"/api/tasks/{task.id}/status",
        {"to_status_id": str(to_status.id), "version": 1},
        format="json",
    )

    task.refresh_from_db()

    assert response.status_code == 200
    assert response.json() == {"task": serialize_task(task)}
    assert task.status_id == to_status.id
    assert task.version == 2


def test_change_task_status_rejects_invalid_transition():
    admin_user = create_user(
        email="task-status-invalid-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-status-invalid-member@example.com")
    project = create_project(owner=admin_user, code="INV", name="Invalid Status")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = create_task(project=project, created_by=admin_user, title="Initial title")
    client = APIClient()
    client.force_login(member_user)
    to_status = get_status(TaskStatusName.DONE)

    response = client.post(
        f"/api/tasks/{task.id}/status",
        {"to_status_id": str(to_status.id), "version": 1},
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "INVALID_STATUS_TRANSITION",
            "message": "The requested status transition is not allowed.",
            "details": {},
        }
    }


def test_task_detail_computes_overdue_state():
    admin_user = create_user(
        email="task-overdue-admin@example.com",
        is_admin=True,
    )
    member_user = create_user(email="task-overdue-member@example.com")
    project = create_project(owner=admin_user, code="DUE", name="Overdue Task")
    create_membership(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    overdue_task = create_task(
        project=project,
        created_by=admin_user,
        title="Overdue task",
        deadline=timezone.localdate() - timedelta(days=1),
    )
    done_task = create_task(
        project=project,
        created_by=admin_user,
        title="Done task",
        deadline=timezone.localdate() - timedelta(days=1),
        status_name=TaskStatusName.DONE,
    )
    client = APIClient()
    client.force_login(member_user)

    overdue_response = client.get(f"/api/tasks/{overdue_task.id}")
    done_response = client.get(f"/api/tasks/{done_task.id}")

    assert overdue_response.status_code == 200
    assert overdue_response.json()["task"]["is_overdue"] is True
    assert done_response.status_code == 200
    assert done_response.json()["task"]["is_overdue"] is False
