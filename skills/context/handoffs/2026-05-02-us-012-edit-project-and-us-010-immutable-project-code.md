# US-012 - Edit Project and US-010 - Immutable Project Code

## What Landed

- Added `PATCH /api/projects/{project_id}` in the `projects` module.
- Edit permission is now:
  - Admin can edit any visible active project.
  - Active `PROJECT_MANAGER` members can edit their project.
  - Team Members receive `PROJECT_PERMISSION_DENIED`.
- Editable fields on the PATCH route:
  - `name`
  - `description`
  - `start_date`
  - `end_date`
- Project code is now enforced as immutable on the real update surface:
  - any PATCH payload containing `code` returns `PROJECT_CODE_IMMUTABLE`
  - the project row is not mutated

## Frontend Outcome

- The project detail workspace now includes a real edit form.
- The edit form is prefilled from the selected project detail query and updates the shared project caches on success.
- Project code stays visible but read-only in the edit UI.
- Read-only project members now see a locked edit state instead of an editable form.

## Tests

- Backend: `tests/integration/test_projects_api.py`
  - successful Admin edit
  - successful Project Manager edit
  - Team Member permission denial
  - invalid date range rejection
  - immutable project code rejection
- Frontend:
  - `src/features/projects/ProjectsFlow.test.tsx`
  - `src/features/auth/AuthFlow.test.tsx`

## Validation Snapshot

- Backend: `.\.venv\Scripts\python.exe -m pytest tests\integration\test_projects_api.py` -> `17 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx` -> `22 passed`

## Follow-On Notes

- `US-013 Delete Project With Confirmation` can now build on the established project detail route and edit-capable workspace.
- `US-010` is satisfied by this branch and should be reviewed together with `US-012`, because the invariant only became meaningful once the PATCH route existed.
- Keep the unrelated dirty files out of feature commits:
  - `.gitignore`
  - `AGENTS.md`
  - `issues/sync-policy.md`
  - the untracked migration rename files under `backend/apps/memberships/migrations/` and `backend/apps/projects/migrations/`
