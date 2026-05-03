from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.activity_logs.api.urls")),
    path("api/", include("apps.comments.api.urls")),
    path("api/", include("apps.core.urls")),
    path("api/", include("apps.memberships.api.urls")),
    path("api/", include("apps.notifications.api.urls")),
    path("api/", include("apps.projects.api.urls")),
    path("api/", include("apps.tasks.api.urls")),
    path("api/", include("apps.users.api.urls")),
]
