# US-045 - Paginated Lists

## Metadata
- Area: 12. Search, Filtering, and Pagination
- GitHub labels: `user-story`, `mvp`, `area:search`
- Status: `implemented`
- Wave: `Wave 5`
- Depends on: `US-011`, `US-019`
- Grouped slice: `US-045` + `US-043` + `US-044` + `US-051` + `US-052`

## Scope
- Standardize paginated responses for the current task list surfaces:
  - project task list
  - My Tasks list
- Respect `page` and `page_size` query params.
- Return results plus pagination metadata from the backend and expose page controls in the frontend.

## Acceptance
- List responses include results and pagination metadata.
- Requested page and page size are respected.

## Delivered
- Response contract:
  - `tasks`
  - `pagination.page`
  - `pagination.page_size`
  - `pagination.total_count`
  - `pagination.total_pages`
  - `pagination.has_next`
  - `pagination.has_previous`
- Backend pagination for:
  - `GET /api/projects/{project_id}/tasks`
  - `GET /api/tasks`
- Frontend page controls for project tasks and My Tasks
