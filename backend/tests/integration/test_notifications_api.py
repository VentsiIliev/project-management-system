from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient

from apps.comments.models import Comment
from apps.memberships.models import ProjectMembership, ProjectMembershipRole
from apps.notifications.models import Notification
from apps.projects.models import Project
from apps.tasks.domain.services import update_task as update_task_service
from apps.tasks.models import Task, TaskWorkflowStatus, TaskStatusName


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
    return Project.all_objects.create(owner=owner, code=code, name=name)


def create_membership(*, project, user, role):
    return ProjectMembership.all_objects.create(project=project, user=user, role=role)


def get_status(name: str) -> TaskWorkflowStatus:
    status, _ = TaskWorkflowStatus.objects.get_or_create(
        name=name,
        defaults={"sort_order": 1, "is_final": name == TaskStatusName.DONE, "is_active": True},
    )
    return status


def create_task(*, project, created_by, assignee=None, collaborators=None, title="Initial task"):
    project.task_counter += 1
    project.save(update_fields=["task_counter", "updated_at"])
    task = Task.all_objects.create(
        project=project,
        task_number=project.task_counter,
        task_key=f"{project.code}-{project.task_counter}",
        title=title,
        status=get_status(TaskStatusName.TODO),
        created_by=created_by,
        primary_assignee=assignee,
    )
    if collaborators:
        task.collaborators.set(collaborators)
    return task


def serialize_notification(notification: Notification):
    return {
        "id": str(notification.id),
        "event_type": notification.event_type,
        "message": notification.message,
        "is_read": notification.is_read,
        "read_at": notification.read_at.isoformat().replace("+00:00", "Z") if notification.read_at else None,
        "metadata": notification.metadata,
        "created_at": notification.created_at.isoformat().replace("+00:00", "Z"),
    }


def test_task_update_creates_notifications_for_relevant_participants_only():
    admin_user = create_user(email="notify-admin@example.com", is_admin=True, must_reset_password=False)
    creator_user = create_user(email="notify-creator@example.com")
    assignee_user = create_user(email="notify-assignee@example.com")
    collaborator_user = create_user(email="notify-collaborator@example.com")
    commenter_user = create_user(email="notify-commenter@example.com")
    removed_user = create_user(email="notify-removed@example.com")
    project = create_project(owner=creator_user, code="NTF", name="Notifications")
    create_membership(project=project, user=creator_user, role=ProjectMembershipRole.PROJECT_MANAGER)
    create_membership(project=project, user=assignee_user, role=ProjectMembershipRole.TEAM_MEMBER)
    create_membership(project=project, user=collaborator_user, role=ProjectMembershipRole.TEAM_MEMBER)
    create_membership(project=project, user=commenter_user, role=ProjectMembershipRole.TEAM_MEMBER)
    removed_membership = create_membership(project=project, user=removed_user, role=ProjectMembershipRole.TEAM_MEMBER)
    removed_membership.deleted_at = project.created_at
    removed_membership.save(update_fields=["deleted_at", "updated_at"])
    task = create_task(
        project=project,
        created_by=creator_user,
        assignee=assignee_user,
        collaborators=[collaborator_user],
    )
    Comment.objects.create(
        task=task,
        author=commenter_user,
        author_name_snapshot=commenter_user.name,
        content="Earlier context",
    )

    updated_task = update_task_service(
        actor=admin_user,
        task_id=task.id,
        version=task.version,
        description="Updated through admin action",
    )

    assert updated_task.description == "Updated through admin action"
    assert Notification.objects.filter(user=creator_user, event_type="TASK_UPDATED").exists()
    assert Notification.objects.filter(user=assignee_user, event_type="TASK_UPDATED").exists()
    assert Notification.objects.filter(user=collaborator_user, event_type="TASK_UPDATED").exists()
    assert Notification.objects.filter(user=commenter_user, event_type="TASK_UPDATED").exists()
    assert not Notification.objects.filter(user=admin_user).exists()
    assert not Notification.objects.filter(user=removed_user).exists()


def test_notification_list_is_newest_first_with_pagination():
    user = create_user(email="notification-list@example.com")
    older = Notification.objects.create(
        user=user,
        event_type="TASK_UPDATED",
        message="Older",
        metadata={"task_id": "task-1"},
    )
    newer = Notification.objects.create(
        user=user,
        event_type="COMMENT_CREATED",
        message="Newer",
        metadata={"task_id": "task-2"},
    )
    Notification.objects.filter(id=older.id).update(created_at=timezone.now() - timedelta(minutes=1))
    Notification.objects.filter(id=newer.id).update(created_at=timezone.now())
    older.refresh_from_db()
    newer.refresh_from_db()
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/notifications?page=1&page_size=1")

    assert response.status_code == 200
    assert response.json() == {
        "notifications": [serialize_notification(newer)],
        "pagination": {
            "page": 1,
            "page_size": 1,
            "total_count": 2,
            "total_pages": 2,
            "has_next": True,
            "has_previous": False,
        },
    }
    assert older.id != newer.id


def test_notification_read_endpoints_update_state():
    user = create_user(email="notification-read@example.com")
    first = Notification.objects.create(user=user, event_type="TASK_UPDATED", message="First", metadata={})
    second = Notification.objects.create(user=user, event_type="COMMENT_CREATED", message="Second", metadata={})
    client = APIClient()
    client.force_login(user)

    single_response = client.post(f"/api/notifications/{first.id}/read", format="json")
    all_response = client.post("/api/notifications/read-all", format="json")

    first.refresh_from_db()
    second.refresh_from_db()

    assert single_response.status_code == 200
    assert single_response.json()["notification"]["is_read"] is True
    assert all_response.status_code == 200
    assert all_response.json() == {"updated_count": 1}
    assert first.is_read is True
    assert second.is_read is True


def test_notification_empty_state_returns_empty_results():
    user = create_user(email="notification-empty@example.com")
    client = APIClient()
    client.force_login(user)

    response = client.get("/api/notifications")

    assert response.status_code == 200
    assert response.json() == {
        "notifications": [],
        "pagination": {
            "page": 1,
            "page_size": 10,
            "total_count": 0,
            "total_pages": 1,
            "has_next": False,
            "has_previous": False,
        },
    }
