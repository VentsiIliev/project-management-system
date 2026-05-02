# US-011 - View Project

## What Landed

- Added project read access on the backend:
  - `GET /api/projects` returns the active projects visible to the authenticated user.
  - `GET /api/projects/{project_id}` returns a single active visible project.
- Visibility rule for this slice:
  - Admin can view any active project.
  - Active project members can view their project.
  - Non-members and removed members receive `PROJECT_NOT_FOUND` on detail reads.
- Added `backend/apps/projects/selectors.py` so project read filtering stays in the owning module instead of leaking membership predicates into views.

## Frontend Outcome

- The protected shell now shows an accessible-project list instead of acting like a create-only placeholder.
- Added a dedicated protected project route at `/projects/:projectId`.
- Opening a project loads the backend detail payload into the workspace.
- The create-project form remains in the workspace and navigates into the newly created project on success.
- Added explicit loading, empty, and unavailable states for project reads.

## Tests

- Backend: `tests/integration/test_projects_api.py`
  - member list filtering
  - admin visibility
  - allowed detail read
  - non-member blocked detail read
  - removed-member blocked detail read
- Frontend:
  - `src/features/projects/ProjectsFlow.test.tsx`
  - `src/features/auth/AuthFlow.test.tsx`

## Validation Snapshot

- Backend: `.\.venv\Scripts\python.exe -m pytest tests\integration\test_projects_api.py` -> `12 passed`
- Frontend: `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx` -> `20 passed`

## Follow-On Notes

- `US-012 Edit Project` should build on the new detail route and read contract.
- `US-010 Immutable Project Code` now has a meaningful implementation surface once the update path exists.
- Keep the unrelated dirty files out of feature commits:
  - `.gitignore`
  - `AGENTS.md`
  - `issues/sync-policy.md`
  - the untracked migration rename files under `backend/apps/memberships/migrations/` and `backend/apps/projects/migrations/`
