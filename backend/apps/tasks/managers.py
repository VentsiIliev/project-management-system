from django.db import models


class ActiveTaskManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class AllTaskManager(models.Manager):
    pass
