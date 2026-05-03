from django.urls import path

from .views import ProjectActivityListView, TaskActivityListView


urlpatterns = [
    path("tasks/<uuid:task_id>/activity", TaskActivityListView.as_view(), name="task-activity"),
    path("projects/<uuid:project_id>/activity", ProjectActivityListView.as_view(), name="project-activity"),
]
