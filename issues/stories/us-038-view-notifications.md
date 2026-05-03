# US-038 - View Notifications

## Metadata
- Area: 10. Notifications
- GitHub labels: `user-story`, `mvp`, `area:notifications`
- Status: `implemented`
- Wave: `Wave 4`
- Depends on: `US-037`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Expose a paginated in-app notification inbox ordered newest-first.
- Render notifications in the existing workspace UI.

## Acceptance
- Users can view their notifications without leaving the app.
- Notifications are returned newest-first with pagination metadata.

## Delivered
- `GET /api/notifications`
- Newest-first notification selector with pagination metadata
- Workspace notification panel backed by the notifications query hook
