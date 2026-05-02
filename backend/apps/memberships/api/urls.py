from django.urls import path

from .views import ProjectMemberListCreateView


urlpatterns = [
    path(
        "projects/<uuid:project_id>/members",
        ProjectMemberListCreateView.as_view(),
        name="project-members",
    ),
]
