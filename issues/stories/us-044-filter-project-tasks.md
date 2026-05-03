# US-044 - Filter Project Tasks

## Metadata
- Area: 12. Search, Filtering, and Pagination
- GitHub labels: `user-story`, `mvp`, `area:search`
- Status: `:owner-review`
- Wave: `Wave 5`
- Depends on: `US-017`, `US-045`
- Grouped slice: `US-045` + `US-043` + `US-044` + `US-051` + `US-052`

## Scope
- Add project-task filters for status, priority, assignee, deadline range, and blocked state.
- Support combining search and filters in one request.
- Keep filtering within the visible task set for the selected project.

## Acceptance
- Given project access, filtering by status, priority, assignee, deadline range, or blocked state returns matching tasks.
- Given search and filters together, both criteria are applied to the same query.

## Delivered
- Backend query params on `GET /api/projects/{project_id}/tasks`:
  - `status_id`
  - `priority_id`
  - `assignee_id`
  - `deadline_from`
  - `deadline_to`
  - `is_blocked`
- Frontend filter form in the project workspace task panel
- Combined search + filter test coverage in backend and frontend
