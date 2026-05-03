# US-036 - WebSocket Reconnection

## Metadata
- Area: 9. Comments and Real-Time Updates
- GitHub labels: `user-story`, `mvp`, `area:comments`
- Status: `implemented`
- Wave: `Wave 4`
- Depends on: `US-035`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Reconnect the task comment socket automatically after disconnects.
- Fetch missed comments after reconnect so the timeline catches up without a full task reload.

## Acceptance
- Temporary socket disconnects do not require manual page refresh.
- Missed comments appear after reconnect.

## Delivered
- Reconnecting task-comment socket hook in the projects feature
- `since_comment_id` support on comment reads for catch-up fetches
- Task detail uses the reconnect flow to merge missed comments back into the visible timeline
