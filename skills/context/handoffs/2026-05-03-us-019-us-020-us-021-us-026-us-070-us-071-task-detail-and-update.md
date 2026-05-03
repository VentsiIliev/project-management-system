# Task Detail And Update Foundation

## Delivered Slice

- Grouped `US-019`, `US-020`, `US-021`, `US-026`, `US-070`, and `US-071` into one task-detail and task-update foundation slice.
- Rewrote the local issue files so the backlog matches the real execution surface instead of the earlier placeholder breakdowns.
- Added backend task detail and mutation support:
  - `GET /api/tasks/{task_id}`
  - `PATCH /api/tasks/{task_id}`
  - `POST /api/tasks/{task_id}/status`
- Added collaborator persistence through `TaskCollaborator` and task `collaborators`.
- Added shared backend validation for:
  - visible-task reads
  - role-based task field updates
  - active-member assignee and collaborator checks
  - optimistic locking
  - database-driven status transitions
  - computed overdue state
- Extended the project workspace frontend with:
  - task selection and detail panel
  - manager task edit form
  - Team Member description-only edit path
  - status-change actions from workflow metadata
  - optimistic-lock conflict refresh messaging
  - loading, empty, not-found, and error states for task detail

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_auth_api.py backend\tests\integration\test_projects_api.py backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `123 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx` -> `16 passed`

## Follow-On Notes

- Task detail currently returns stable empty `subtasks` and `dependencies` arrays and `is_blocked = false` until the later subtask and dependency slices land.
- `US-054` and `US-060` drift is recorded in `issues/review-findings.md`; `US-054` is effectively already delivered, while `US-060` should continue to be absorbed as a cross-slice frontend definition-of-done rule.
