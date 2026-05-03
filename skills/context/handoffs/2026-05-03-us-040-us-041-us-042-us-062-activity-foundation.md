## Slice

- `US-040` Record task activity
- `US-041` View task activity
- `US-042` View project activity
- `US-062` Preserve historical references

## Delivered

- Added `activity_logs` backend app with immutable activity entries, snapshot fields, and project/task read endpoints.
- Wired activity recording into current task, project, and membership mutations.
- Added project and task activity panels to the existing workspace UI.
- Preserved historical labels for actor, project, task, and related-user references through snapshot fields so soft-deleted rows do not break activity reads.

## Backend Notes

- New model: `backend/apps/activity_logs/models.py`
- Write service: `backend/apps/activity_logs/services.py`
- Read selectors: `backend/apps/activity_logs/selectors.py`
- API routes:
  - `GET /api/projects/{project_id}/activity`
  - `GET /api/tasks/{task_id}/activity`
- Task activity remains readable for visible project members even when the task row is soft-deleted.
- Current emitted events:
  - `TASK_CREATED`
  - `TASK_UPDATED`
  - `TASK_ASSIGNED`
  - `TASK_STATUS_CHANGED`
  - `TASK_DELETED`
  - `SUBTASK_CREATED`
  - `SUBTASK_DELETED`
  - `DEPENDENCY_ADDED`
  - `DEPENDENCY_REMOVED`
  - `PARENT_REOPENED`
  - `PROJECT_DELETED`
  - `MEMBER_ADDED`
  - `MEMBER_REMOVED`
  - `MEMBER_REASSIGNED`

## Frontend Notes

- Added `ActivityEntry` contract to the projects feature types.
- Added project/task activity query helpers and API reads.
- Project details now show a project activity section.
- Task detail now shows a task activity section.
- Existing task/member/task-dependency mutations now invalidate the relevant activity queries so the panels stay current.

## Validation

- Backend: `92 passed`
  - `pytest backend/tests/integration/test_tasks_api.py backend/tests/integration/test_projects_api.py`
- Frontend: `21 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx`

## Follow-on

- Comments should emit `COMMENT_CREATED` through the same activity service instead of creating a parallel audit trail.
- Notifications should consume the same mutation side effects; email remains explicitly out of scope for MVP.
