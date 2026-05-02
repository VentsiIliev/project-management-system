from django.urls import path

from .views import ProjectTaskListCreateView


urlpatterns = [
    path("projects/<uuid:project_id>/tasks", ProjectTaskListCreateView.as_view(), name="project-task-list-create"),
]
