# US-037 - Receive Task Notifications

## Metadata
- Area: 10. Notifications
- GitHub labels: `user-story`, `mvp`, `area:notifications`
- Status: `implemented`
- Wave: `Wave 4`
- Depends on: `US-017`, `US-040`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Create in-app notifications for relevant task participants on task updates and comment creation.
- Exclude the acting user and removed project members from recipients.

## Acceptance
- Relevant participants receive notifications for task/comment events that affect them.
- Users do not notify themselves.

## Delivered
- Notification creation for task updates and comment creation
- Recipient selection covers creator, active assignee, active collaborators, and active commenters
- Removed members and acting users are excluded from delivery
