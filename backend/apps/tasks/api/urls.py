from django.urls import path

from .views import (
    ProjectTaskListCreateView,
    TaskPriorityListView,
    TaskStatusTransitionListView,
    WorkflowMetadataView,
)


urlpatterns = [
    path("task-statuses", WorkflowMetadataView.as_view(), name="task-status-list"),
    path("task-status-transitions", TaskStatusTransitionListView.as_view(), name="task-status-transitions"),
    path("task-priorities", TaskPriorityListView.as_view(), name="task-priorities"),
    path("projects/<uuid:project_id>/tasks", ProjectTaskListCreateView.as_view(), name="project-task-list-create"),
]
