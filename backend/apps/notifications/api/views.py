from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.selectors import list_notifications_for_user
from apps.notifications.services import NotificationNotFoundError, mark_all_notifications_read, mark_notification_read
from apps.tasks.api.views import error_response

from .serializers import NotificationListSerializer


def serialize_notification(notification):
    return {
        "id": str(notification.id),
        "event_type": notification.event_type,
        "message": notification.message,
        "is_read": notification.is_read,
        "read_at": notification.read_at.isoformat().replace("+00:00", "Z") if notification.read_at else None,
        "metadata": notification.metadata,
        "created_at": notification.created_at.isoformat().replace("+00:00", "Z"),
    }


class NotificationListView(APIView):
    def get(self, request):
        serializer = NotificationListSerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                code="VALIDATION_ERROR",
                message="Invalid input",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        notifications, pagination = list_notifications_for_user(
            user=request.user,
            page=serializer.validated_data["page"],
            page_size=serializer.validated_data["page_size"],
        )
        return Response(
            {
                "notifications": [serialize_notification(notification) for notification in notifications],
                "pagination": pagination,
            },
            status=status.HTTP_200_OK,
        )


class NotificationReadDetailView(APIView):
    def post(self, request, notification_id):
        try:
            notification = mark_notification_read(user=request.user, notification_id=notification_id)
        except NotificationNotFoundError:
            return error_response(
                code="NOTIFICATION_NOT_FOUND",
                message="Notification not found.",
                details={},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return Response({"notification": serialize_notification(notification)}, status=status.HTTP_200_OK)


class NotificationReadAllView(APIView):
    def post(self, request):
        updated_count = mark_all_notifications_read(user=request.user)
        return Response({"updated_count": updated_count}, status=status.HTTP_200_OK)
