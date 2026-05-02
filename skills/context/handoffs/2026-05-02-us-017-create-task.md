# US-017 Create Task

## Delivered Slice

- Added the first `tasks` backend module with a minimal task model and migration in `backend/apps/tasks/`.
- Added `GET /api/projects/{project_id}/tasks` for visible project users.
- Added `POST /api/projects/{project_id}/tasks` for Admins and active `PROJECT_MANAGER`s only.
- Task creation currently supports:
  - `title`
  - optional `description`
  - optional `start_date`
  - optional `deadline`
  - optional `primary_assignee_id`
- Created tasks default to `TODO`, get `version = 1`, and use immutable project-code keys like `ENG-1`.
- Assignee validation requires an active user with an active membership on the same project.
- Frontend project workspace now includes a visible task panel with:
  - task list
  - create-task form
  - read-only restricted state for Team Members

## Intentional Deferrals

- Database-driven statuses remain deferred to `US-028`.
- Database-driven priorities remain deferred to `US-053`.
- Task detail route, update flows, collaborators, subtasks, activity logs, notifications, and search/filtering are not part of this slice.
- The current task model uses an app-level `TODO` status enum as a temporary foundation until the status catalog stories land.

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest tests\integration\test_projects_api.py tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `46 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx` -> `29 passed`

## Next Recommended Step

- The cleanest follow-up is to normalize task metadata by grouping `US-028 Database-Driven Statuses` with `US-053 Use Database-Driven Priorities`, then extend task create/edit flows on top of those catalogs.
