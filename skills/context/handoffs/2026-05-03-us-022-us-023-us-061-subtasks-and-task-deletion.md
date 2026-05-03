# Subtasks And Task Deletion Slice

## Delivered Slice

- Grouped `US-023`, `US-022`, and `US-061` into one task hierarchy and lifecycle slice.
- Rewrote the local story files so the backlog matches the real shared implementation surface.
- Added one-level task hierarchy support with optional `parent_task_id` on task creation.
- Enforced that parent tasks must be visible active tasks in the same project and that subtasks cannot have children.
- Added task soft-delete support on `DELETE /api/tasks/{task_id}` with cascade confirmation for parent tasks that still have active subtasks.
- Kept normal task reads scoped to non-deleted tasks, including parent detail subtask lists.
- Extended the project workspace frontend with:
  - parent-task selection in the create-task form
  - subtask visibility in task detail
  - task delete action with cascade confirmation
  - selected-task cleanup after deletion

## Contract Notes

- `POST /api/projects/{project_id}/tasks` now accepts optional `parent_task_id`.
- `GET /api/tasks/{task_id}` and existing task list responses now include:
  - `parent_task_id`
  - active `subtasks`
- `DELETE /api/tasks/{task_id}` accepts optional body:
  - `confirm_cascade_subtasks: boolean`
- New delete error contract:
  - `CASCADE_CONFIRMATION_REQUIRED`
- New create-hierarchy error contract:
  - `INVALID_HIERARCHY`

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `34 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx` -> `18 passed`

## Follow-On Notes

- Parent-completion and parent-auto-reopen rules are still deferred to the next grouped slice: `US-024` + `US-025`.
- The current task list stays flat even though task detail now exposes subtasks. Grouped read-model presentation can be refined later when dependency, Kanban, and list slices land.
