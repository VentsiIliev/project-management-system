from django.urls import path

from apps.comments.consumers import TaskCommentConsumer


websocket_urlpatterns = [
    path("ws/tasks/<uuid:task_id>/comments", TaskCommentConsumer.as_asgi()),
]
