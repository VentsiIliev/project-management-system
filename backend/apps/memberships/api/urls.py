from django.urls import path

from .views import ProjectMemberDetailView, ProjectMemberListCreateView


urlpatterns = [
    path(
        "projects/<uuid:project_id>/members",
        ProjectMemberListCreateView.as_view(),
        name="project-members",
    ),
    path(
        "projects/<uuid:project_id>/members/<uuid:user_id>",
        ProjectMemberDetailView.as_view(),
        name="project-member-detail",
    ),
]
