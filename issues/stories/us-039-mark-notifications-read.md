# US-039 - Mark Notifications Read

## Metadata
- Area: 10. Notifications
- GitHub labels: `user-story`, `mvp`, `area:notifications`
- Status: `:owner-review`
- Wave: `Wave 4`
- Depends on: `US-038`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Support marking one notification or the full unread set as read.
- Reflect read state in the existing workspace notification UI.

## Acceptance
- A user can mark one notification as read.
- A user can mark all unread notifications as read.

## Delivered
- `POST /api/notifications/{notification_id}/read`
- `POST /api/notifications/read-all`
- Notification read and mark-all actions wired into the notification panel
