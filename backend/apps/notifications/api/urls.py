from django.urls import path

from .views import NotificationListView, NotificationReadAllView, NotificationReadDetailView


urlpatterns = [
    path("notifications", NotificationListView.as_view(), name="notifications"),
    path("notifications/read-all", NotificationReadAllView.as_view(), name="notifications-read-all"),
    path("notifications/<uuid:notification_id>/read", NotificationReadDetailView.as_view(), name="notification-read"),
]
