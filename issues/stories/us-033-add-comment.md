# US-033 - Add Comment

## Metadata
- Area: 9. Comments and Real-Time Updates
- GitHub labels: `user-story`, `mvp`, `area:comments`
- Status: `:owner-review`
- Wave: `Wave 4`
- Depends on: `US-019`, `US-001`, `US-040`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Allow visible project members to list and create immutable task comments.
- Reject empty content.
- Emit activity and in-app notification side effects on successful creation.

## Acceptance
- Visible members can create a non-empty comment on a visible task.
- Empty comments are rejected with structured validation errors.
- Successful comment creation produces activity and notification events.

## Delivered
- `GET /api/tasks/{task_id}/comments`
- `POST /api/tasks/{task_id}/comments`
- Task-detail comment composer and timeline in the existing workspace UI
- Comment creation emits `COMMENT_CREATED` activity and in-app notifications
