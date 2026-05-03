# US-028 and US-053 Task Metadata

## Delivered Slice

- Replaced the temporary task status enum with database-backed task workflow tables in `backend/apps/tasks/`.
- Added seeded MVP task statuses: `TODO`, `IN_PROGRESS`, and `DONE`.
- Added seeded task priorities: `LOW`, `MEDIUM`, `HIGH`, and `URGENT`.
- Added seeded task status transitions for the later workflow stories.
- Updated `POST /api/projects/{project_id}/tasks` to accept optional `priority_id`.
- Updated `GET /api/projects/{project_id}/tasks` and task-create responses to return structured status and priority objects.
- Added workflow metadata endpoints:
  - `GET /api/task-statuses`
  - `GET /api/task-status-transitions`
  - `GET /api/task-priorities`
- Extended the project workspace task form to load metadata, allow priority selection, and render inactive returned priorities and statuses in the task list.

## Intentional Deferrals

- Task status mutation remains deferred to `US-026`.
- Task update with optimistic locking remains deferred to `US-020`.
- Kanban rendering and drag rules remain deferred to `US-046` and `US-047`.
- Admin editing of status and priority catalogs is still future work. This slice seeds and reads the catalogs only.

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_projects_api.py backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `48 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx` -> `29 passed`

## Follow-On Guidance

- `US-054` can now consume the existing workflow metadata endpoints instead of inventing a separate backend contract.
- `US-026` should build on the seeded transitions and return `INVALID_STATUS_TRANSITION` from the dedicated status endpoint.
- `US-019` and `US-020` should reuse the structured `status` and `priority` payload shapes introduced in this slice.
