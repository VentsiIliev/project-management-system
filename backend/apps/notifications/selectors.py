from math import ceil

from apps.notifications.models import Notification


def paginate_queryset(*, queryset, page: int, page_size: int):
    total_count = queryset.count()
    total_pages = max(1, ceil(total_count / page_size)) if total_count else 1
    page = max(1, min(page, total_pages))
    start = (page - 1) * page_size
    end = start + page_size
    return list(queryset[start:end]), {
        "page": page,
        "page_size": page_size,
        "total_count": total_count,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }


def list_notifications_for_user(*, user, page: int, page_size: int):
    queryset = Notification.objects.filter(user=user).order_by("-created_at", "-id")
    return paginate_queryset(queryset=queryset, page=page, page_size=page_size)
