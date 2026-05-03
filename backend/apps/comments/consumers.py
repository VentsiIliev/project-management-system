from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from apps.tasks.selectors import visible_tasks_for_user


class TaskCommentConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope["url_route"]["kwargs"]["task_id"]
        user = self.scope.get("user")

        if not await self._can_access_task(user=user, task_id=self.task_id):
            await self.close(code=4403)
            return

        self.group_name = f"task-comments-{self.task_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        group_name = getattr(self, "group_name", None)
        if group_name is not None:
            await self.channel_layer.group_discard(group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        return None

    async def comment_created(self, event):
        await self.send_json({"type": "comment.created", "comment": event["comment"]})

    @database_sync_to_async
    def _can_access_task(self, *, user, task_id):
        return visible_tasks_for_user(user=user).filter(id=task_id).exists()
