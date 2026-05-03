# US-035 - Real-Time Comment Broadcast

## Metadata
- Area: 9. Comments and Real-Time Updates
- GitHub labels: `user-story`, `mvp`, `area:comments`
- Status: `:owner-review`
- Wave: `Wave 4`
- Depends on: `US-033`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Broadcast new task comments over a task-scoped WebSocket channel to authorized viewers only.
- Keep the REST write path authoritative, with the socket broadcasting only after successful persistence.

## Acceptance
- Authorized project members viewing the task receive new comments in real time.
- Unauthorized users are rejected from the comment channel.

## Delivered
- `ws/tasks/{task_id}/comments` consumer with membership-based authorization
- `comment.created` payloads broadcast after successful comment writes
- Task detail subscribes to the task comment channel while the selected task is open
