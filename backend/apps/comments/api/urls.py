from django.urls import path

from .views import TaskCommentListCreateView


urlpatterns = [
    path("tasks/<uuid:task_id>/comments", TaskCommentListCreateView.as_view(), name="task-comments"),
]
