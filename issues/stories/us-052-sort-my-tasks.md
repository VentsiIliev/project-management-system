# US-052 - Sort My Tasks

## Metadata
- Area: 15. My Tasks
- GitHub labels: `user-story`, `mvp`, `area:my-tasks`
- Status: `implemented`
- Wave: `Wave 5`
- Depends on: `US-051`
- Grouped slice: `US-045` + `US-043` + `US-044` + `US-051` + `US-052`

## Scope
- Support My Tasks sorting by deadline and priority.
- Preserve blocked and overdue indicators in the My Tasks view.

## Acceptance
- My Tasks can be sorted by deadline and priority.
- Overdue and blocked tasks show the relevant indicators.

## Delivered
- Backend query param: `sort_by=deadline|priority` on `GET /api/tasks`
- Frontend sort control in the My Tasks panel
- Existing task serializer indicators reused:
  - `is_blocked`
  - `is_overdue`
- Backend integration coverage and frontend workspace test coverage
