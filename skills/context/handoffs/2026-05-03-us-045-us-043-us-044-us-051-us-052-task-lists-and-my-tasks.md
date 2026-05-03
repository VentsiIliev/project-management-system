## Slice

- `US-045` Paginated lists
- `US-043` Search project tasks
- `US-044` Filter project tasks
- `US-051` View My Tasks
- `US-052` Sort My Tasks

## Delivered

- Added paginated task-list responses for:
  - `GET /api/projects/{project_id}/tasks`
  - `GET /api/tasks`
- Added project-task query params:
  - `search`
  - `status_id`
  - `priority_id`
  - `assignee_id`
  - `deadline_from`
  - `deadline_to`
  - `is_blocked`
  - `page`
  - `page_size`
- Added My Tasks query params:
  - `include_collaborator_tasks`
  - `sort_by=deadline|priority`
  - `page`
  - `page_size`
- Added workspace UI for:
  - project-task search and filtering
  - project-task pagination
  - My Tasks panel
  - collaborator toggle and sort control in My Tasks

## Backend Notes

- Pagination and filtered list logic lives in `backend/apps/tasks/selectors.py`.
- `backend/apps/tasks/domain/services.py` now exposes read helpers for:
  - project task lists with filters
  - My Tasks with optional collaborator scope and sort
- `backend/apps/tasks/api/views.py` now returns `{ tasks, pagination }` for both list endpoints.
- The current implementation keeps pagination scoped to task endpoints only; it does not generalize every list endpoint in the repo yet.

## Frontend Notes

- `frontend/src/features/projects/api/projectsApi.ts` normalizes task-list responses so older tests and cached data can tolerate missing pagination during transitional mocks.
- `useProjectTasksQuery` now keys by project plus params.
- Task mutations invalidate the full project-task query prefix and My Tasks query prefix so filtered pages stay coherent after edits.
- The project workspace now has three task surfaces:
  - project task list
  - task detail
  - My Tasks

## Validation

- Backend: `51 passed`
  - `pytest backend/tests/integration/test_tasks_api.py`
- Frontend: `25 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx`

## Follow-on

- If the owner wants `US-045` interpreted more broadly than task surfaces, split the remaining pagination standardization into a later cross-area cleanup slice instead of broadening this PR retroactively.
