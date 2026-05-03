## Slice

- `US-033` Add comment
- `US-034` Immutable comments
- `US-035` Real-time comment broadcast
- `US-036` WebSocket reconnection
- `US-037` Receive task notifications
- `US-038` View notifications
- `US-039` Mark notifications read
- `US-066` No email notifications in MVP
- `US-067` No attachments in MVP
- `US-072` Enforce comment permanence

## Delivered

- Added `comments` and `notifications` backend apps with API contracts, selectors, and services.
- Added task comment reads and writes, including immutable timeline behavior and non-empty validation.
- Added task comment WebSocket broadcast with membership-based authorization.
- Added reconnect-and-catch-up comment behavior in the workspace task detail UI.
- Added in-app notifications for task updates and comment creation, plus list and read actions.
- Kept the MVP boundary explicit: no email notifications and no attachments.

## Backend Notes

- Comment routes:
  - `GET /api/tasks/{task_id}/comments`
  - `POST /api/tasks/{task_id}/comments`
- Notification routes:
  - `GET /api/notifications`
  - `POST /api/notifications/{notification_id}/read`
  - `POST /api/notifications/read-all`
- WebSocket route:
  - `ws/tasks/{task_id}/comments`
- Comment creation emits:
  - `COMMENT_CREATED` activity
  - in-app notifications to active relevant participants
- Comment mutation is intentionally unsupported; there are no edit/delete routes.

## Frontend Notes

- Task detail now includes:
  - comment timeline
  - comment composer
  - live comment subscription with reconnect flow
- The projects feature now includes a notification panel with pagination and read actions.
- Reconnect catch-up uses `since_comment_id` so missed comments can be fetched after disconnect.

## Validation

- Backend: `106 passed`
  - `pytest backend/tests/integration/test_projects_api.py backend/tests/integration/test_tasks_api.py backend/tests/integration/test_comments_api.py backend/tests/integration/test_notifications_api.py`
- Frontend: `25 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx`

## Follow-on

- Future notification expansion can build on the in-app model without changing the current task/comment contracts.
- Activity and notification event vocabularies are now shared by task and comment side effects.
