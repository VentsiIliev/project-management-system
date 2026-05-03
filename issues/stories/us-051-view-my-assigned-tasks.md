# US-051 - View My Assigned Tasks

## Metadata
- Area: 15. My Tasks
- GitHub labels: `user-story`, `mvp`, `area:my-tasks`
- Status: `:owner-review`
- Wave: `Wave 5`
- Depends on: `US-017`, `US-045`
- Grouped slice: `US-045` + `US-043` + `US-044` + `US-051` + `US-052`

## Scope
- Add a dedicated My Tasks read endpoint and workspace panel.
- List tasks where the current user is the primary assignee.
- Optionally include collaborator tasks when the user enables that view.

## Acceptance
- Primary-assigned tasks appear in My Tasks.
- Collaborator tasks appear when collaborator inclusion is enabled.

## Delivered
- Backend endpoint: `GET /api/tasks`
- Query param: `include_collaborator_tasks`
- Frontend My Tasks panel with collaborator toggle
- Integration and workspace test coverage for both primary-assigned and collaborator-inclusive reads
