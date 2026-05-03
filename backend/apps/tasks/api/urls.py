from django.urls import path

from .views import (
    ProjectTaskListCreateView,
    TaskDependencyDetailView,
    TaskDependencyListCreateView,
    TaskDetailView,
    TaskListView,
    TaskPriorityListView,
    TaskStatusUpdateView,
    TaskStatusTransitionListView,
    WorkflowMetadataView,
)


urlpatterns = [
    path("task-statuses", WorkflowMetadataView.as_view(), name="task-status-list"),
    path("task-status-transitions", TaskStatusTransitionListView.as_view(), name="task-status-transitions"),
    path("task-priorities", TaskPriorityListView.as_view(), name="task-priorities"),
    path("tasks", TaskListView.as_view(), name="task-list"),
    path("projects/<uuid:project_id>/tasks", ProjectTaskListCreateView.as_view(), name="project-task-list-create"),
    path("tasks/<uuid:task_id>", TaskDetailView.as_view(), name="task-detail"),
    path("tasks/<uuid:task_id>/status", TaskStatusUpdateView.as_view(), name="task-status-update"),
    path("tasks/<uuid:task_id>/dependencies", TaskDependencyListCreateView.as_view(), name="task-dependency-list-create"),
    path(
        "tasks/<uuid:task_id>/dependencies/<uuid:depends_on_task_id>",
        TaskDependencyDetailView.as_view(),
        name="task-dependency-detail",
    ),
]
