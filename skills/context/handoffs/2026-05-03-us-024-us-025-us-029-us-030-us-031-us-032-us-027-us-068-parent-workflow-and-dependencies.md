# Parent Workflow And Dependencies Slice

## Delivered Slice

- Grouped `US-024`, `US-025`, `US-029`, `US-030`, `US-031`, `US-032`, `US-027`, and `US-068` into one task workflow and dependency slice.
- Refined the local story files so parent-status invariants and dependency rules no longer drift across placeholder breakdowns.
- Added parent completion enforcement and automatic parent reopen on subtask reopen.
- Added task dependency persistence, same-project validation, duplicate rejection, self-dependency rejection, cycle rejection, remove support, and computed blocked state.
- Extended the project workspace task detail UI with dependency list, add/remove actions, blocked indicators, and new status-change error handling.

## Contract Notes

- `POST /api/tasks/{task_id}/status` now returns:
  - `SUBTASKS_INCOMPLETE`
  - `TASK_BLOCKED`
- Added dependency endpoints:
  - `GET /api/tasks/{task_id}/dependencies`
  - `POST /api/tasks/{task_id}/dependencies`
  - `DELETE /api/tasks/{task_id}/dependencies/{depends_on_task_id}`
- `Task` responses now return real computed values for:
  - `is_blocked`
  - `dependencies`

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `45 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx` -> `20 passed`

## Follow-On Notes

- `PARENT_REOPENED` activity-log emission is still deferred to `US-040` and `US-041`.
- The dependency concurrency guard is implemented by serializing project-scoped dependency mutations and retrying on transient SQLite lock errors in tests.
- Task list grouping under parents is still flat outside the task detail subtask view. That follow-on remains separate from the dependency/workflow invariants delivered here.
