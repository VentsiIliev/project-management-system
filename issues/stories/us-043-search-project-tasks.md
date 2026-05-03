# US-043 - Search Project Tasks

## Metadata
- Area: 12. Search, Filtering, and Pagination
- GitHub labels: `user-story`, `mvp`, `area:search`
- Status: `:owner-review`
- Wave: `Wave 5`
- Depends on: `US-017`, `US-045`
- Grouped slice: `US-045` + `US-043` + `US-044` + `US-051` + `US-052`

## Scope
- Add per-project task search over `task_key`, `title`, and `description`.
- Keep results scoped to visible tasks in the requested project only.
- Apply search before pagination so page metadata reflects the filtered result set.

## Acceptance
- Given project access, searching by title, description, or task key returns matching non-deleted tasks from that project.
- Tasks from other projects remain excluded even when they also match the search term.

## Delivered
- Backend query param: `search` on `GET /api/projects/{project_id}/tasks`
- Combined with the new paginated task-list response
- Frontend search control in the project workspace task panel
- Backend integration coverage and frontend workspace test coverage
