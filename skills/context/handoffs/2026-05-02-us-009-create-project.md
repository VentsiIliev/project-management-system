# US-009 - Create Project

## What Changed

- Added the first `projects` and `project_memberships` backend implementation slice.
- Added `POST /api/projects` with create-only behavior, date validation, duplicate-code rejection, and structured permission errors.
- Replaced the authenticated-shell placeholder with a real project creation screen that persists the created project payload in the UI.

## Implementation Notes

- Project creation permission uses the working rule:
  - Admins may always create projects.
  - Non-admin users may create projects only if they already hold at least one active `PROJECT_MANAGER` membership.
  - Team Members are denied.
- Successful project creation also creates a `PROJECT_MANAGER` membership for the creator on the new project.
- This slice intentionally does not add project list, detail, edit, or delete behavior.

## Validation

- Backend: `py -3.12 -m pytest tests/integration/test_auth_api.py tests/integration/test_projects_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `48 passed`
- Frontend: `npm run test:run -- src/features/auth/AuthFlow.test.tsx src/features/projects/ProjectsFlow.test.tsx` -> `17 passed`

## Boundaries

- No project list API or view route yet.
- No member-management UI or APIs beyond the creator membership inserted on create.
- No task, Kanban, or Gantt work.
- The spec ambiguity around “Project Manager can create projects” was recorded in `issues/review-findings.md`; this slice uses the active-membership rule as the working contract.
