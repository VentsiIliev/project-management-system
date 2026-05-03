import json

import pytest
from asgiref.testing import ApplicationCommunicator
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.activity_logs.models import ActivityLog, ActivityLogEvent
from apps.comments.consumers import TaskCommentConsumer
from apps.comments.models import Comment
from apps.notifications.models import Notification
from apps.projects.models import Project
from apps.memberships.models import ProjectMembership, ProjectMembershipRole
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


def create_task(*, project, created_by, title="Initial task"):
    project.task_counter += 1
    project.save(update_fields=["task_counter", "updated_at"])
    return Task.all_objects.create(
        project=project,
        task_number=project.task_counter,
        task_key=f"{project.code}-{project.task_counter}",
        title=title,
        status=get_status(TaskStatusName.TODO),
        created_by=created_by,
    )


def serialize_comment(comment: Comment):
    return {
        "id": str(comment.id),
        "task_id": str(comment.task_id),
        "author": {"id": str(comment.author_id), "name": comment.author_name_snapshot},
        "content": comment.content,
        "created_at": comment.created_at.isoformat().replace("+00:00", "Z"),
    }


def test_visible_project_member_can_list_and_create_comments():
    admin_user = create_user(email="comments-admin@example.com", is_admin=True, must_reset_password=False)
    member_user = create_user(email="comments-member@example.com")
    watcher_user = create_user(email="comments-watcher@example.com")
    project = create_project(owner=admin_user, code="COM", name="Comments")
    create_membership(project=project, user=admin_user, role=ProjectMembershipRole.PROJECT_MANAGER)
    create_membership(project=project, user=member_user, role=ProjectMembershipRole.TEAM_MEMBER)
    create_membership(project=project, user=watcher_user, role=ProjectMembershipRole.TEAM_MEMBER)
    task = create_task(project=project, created_by=admin_user)
    existing_comment = Comment.objects.create(
        task=task,
        author=admin_user,
        author_name_snapshot=admin_user.name,
        content="Existing comment",
    )
    client = APIClient()
    client.force_login(member_user)

    list_response = client.get(f"/api/tasks/{task.id}/comments")
    create_response = client.post(
        f"/api/tasks/{task.id}/comments",
        {"content": "New collaboration detail"},
        format="json",
    )

    created_comment = Comment.objects.get(content="New collaboration detail")

    assert list_response.status_code == 200
    assert list_response.json() == {"comments": [serialize_comment(existing_comment)]}
    assert create_response.status_code == 201
    assert create_response.json() == {"comment": serialize_comment(created_comment)}
    assert ActivityLog.objects.filter(
        event_type=ActivityLogEvent.COMMENT_CREATED,
        task=task,
        actor=member_user,
    ).exists()
    assert Notification.objects.filter(user=admin_user, event_type=ActivityLogEvent.COMMENT_CREATED).exists()
    assert not Notification.objects.filter(user=watcher_user).exists()
    assert not Notification.objects.filter(user=member_user).exists()


def test_comment_creation_rejects_empty_content():
    admin_user = create_user(email="empty-comment-admin@example.com", is_admin=True, must_reset_password=False)
    member_user = create_user(email="empty-comment-member@example.com")
    project = create_project(owner=admin_user, code="ECT", name="Empty Comment Test")
    create_membership(project=project, user=member_user, role=ProjectMembershipRole.TEAM_MEMBER)
    task = create_task(project=project, created_by=admin_user)
    client = APIClient()
    client.force_login(member_user)

    response = client.post(
        f"/api/tasks/{task.id}/comments",
        {"content": "   "},
        format="json",
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "Invalid input",
            "details": {"content": ["This field may not be blank."]},
        }
    }


def test_non_member_cannot_access_task_comments():
    admin_user = create_user(email="hidden-comment-admin@example.com", is_admin=True, must_reset_password=False)
    outsider_user = create_user(email="hidden-comment-outsider@example.com")
    project = create_project(owner=admin_user, code="HCT", name="Hidden Comments")
    task = create_task(project=project, created_by=admin_user)
    client = APIClient()
    client.force_login(outsider_user)

    list_response = client.get(f"/api/tasks/{task.id}/comments")
    create_response = client.post(
        f"/api/tasks/{task.id}/comments",
        {"content": "No access"},
        format="json",
    )

    expected = {
        "error": {
            "code": "TASK_NOT_FOUND",
            "message": "Task not found.",
            "details": {},
        }
    }
    assert list_response.status_code == 404
    assert list_response.json() == expected
    assert create_response.status_code == 404
    assert create_response.json() == expected


def test_comment_list_can_fetch_only_comments_after_reference():
    admin_user = create_user(email="since-comment-admin@example.com", is_admin=True, must_reset_password=False)
    member_user = create_user(email="since-comment-member@example.com")
    project = create_project(owner=admin_user, code="SCT", name="Since Comment Test")
    create_membership(project=project, user=member_user, role=ProjectMembershipRole.TEAM_MEMBER)
    task = create_task(project=project, created_by=admin_user)
    first_comment = Comment.objects.create(
        task=task,
        author=admin_user,
        author_name_snapshot=admin_user.name,
        content="First comment",
    )
    second_comment = Comment.objects.create(
        task=task,
        author=member_user,
        author_name_snapshot=member_user.name,
        content="Second comment",
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.get(f"/api/tasks/{task.id}/comments?since_comment_id={first_comment.id}")

    assert response.status_code == 200
    assert response.json() == {"comments": [serialize_comment(second_comment)]}


def test_comment_edit_delete_endpoints_are_not_available():
    admin_user = create_user(email="immutable-comments-admin@example.com", is_admin=True, must_reset_password=False)
    member_user = create_user(email="immutable-comments-member@example.com")
    project = create_project(owner=admin_user, code="IMM", name="Immutable Comments")
    create_membership(project=project, user=member_user, role=ProjectMembershipRole.TEAM_MEMBER)
    task = create_task(project=project, created_by=admin_user)
    comment = Comment.objects.create(
        task=task,
        author=member_user,
        author_name_snapshot=member_user.name,
        content="Permanent note",
    )
    client = APIClient()
    client.force_login(member_user)

    response = client.patch(
        f"/api/tasks/{task.id}/comments/{comment.id}",
        {"content": "Edited"},
        format="json",
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_authorized_project_member_receives_comment_websocket_broadcast():
    admin_user = await sync_to_async(create_user)(
        email="comments-ws-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    member_user = await sync_to_async(create_user)(email="comments-ws-member@example.com")
    project = await sync_to_async(create_project)(owner=admin_user, code="WSC", name="WebSocket Comments")
    await sync_to_async(create_membership)(
        project=project,
        user=member_user,
        role=ProjectMembershipRole.TEAM_MEMBER,
    )
    task = await sync_to_async(create_task)(project=project, created_by=admin_user)

    communicator = ApplicationCommunicator(
        TaskCommentConsumer.as_asgi(),
        {
            "type": "websocket",
            "path": f"/ws/tasks/{task.id}/comments",
            "headers": [],
            "query_string": b"",
            "subprotocols": [],
            "url_route": {"kwargs": {"task_id": str(task.id)}},
            "user": member_user,
        },
    )
    await communicator.send_input({"type": "websocket.connect"})
    connect_event = await communicator.receive_output(timeout=1)
    assert connect_event["type"] == "websocket.accept"

    client = APIClient()
    await sync_to_async(client.force_login)(admin_user)
    create_response = await sync_to_async(
        lambda: client.post(
            f"/api/tasks/{task.id}/comments",
            {"content": "Broadcast me"},
            format="json",
        )
    )()

    payload_event = await communicator.receive_output(timeout=1)
    payload = json.loads(payload_event["text"])

    assert create_response.status_code == 201
    assert payload_event["type"] == "websocket.send"
    assert payload["type"] == "comment.created"
    assert payload["comment"]["content"] == "Broadcast me"

    await communicator.send_input({"type": "websocket.disconnect", "code": 1000})
    await communicator.wait()


@pytest.mark.anyio
async def test_unauthorized_user_is_rejected_from_comment_websocket():
    admin_user = await sync_to_async(create_user)(
        email="comments-ws-hidden-admin@example.com",
        is_admin=True,
        must_reset_password=False,
    )
    outsider_user = await sync_to_async(create_user)(email="comments-ws-outsider@example.com")
    project = await sync_to_async(create_project)(
        owner=admin_user,
        code="WSH",
        name="Hidden WebSocket Comments",
    )
    task = await sync_to_async(create_task)(project=project, created_by=admin_user)

    communicator = ApplicationCommunicator(
        TaskCommentConsumer.as_asgi(),
        {
            "type": "websocket",
            "path": f"/ws/tasks/{task.id}/comments",
            "headers": [],
            "query_string": b"",
            "subprotocols": [],
            "url_route": {"kwargs": {"task_id": str(task.id)}},
            "user": outsider_user,
        },
    )
    await communicator.send_input({"type": "websocket.connect"})
    close_event = await communicator.receive_output(timeout=1)

    assert close_event["type"] == "websocket.close"
    assert close_event["code"] == 4403
