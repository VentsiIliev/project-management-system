# US-015 And US-016 - Membership Management

## Delivered Slice

- Added the remaining membership detail endpoints:
  - `PATCH /api/projects/{project_id}/members/{user_id}`
  - `DELETE /api/projects/{project_id}/members/{user_id}`
- Role updates now apply immediately to backend permission behavior.
- Membership removal now soft-deletes the active membership row and uses the existing project visibility filters to remove access immediately.
- Missing target active memberships return:
  - `PROJECT_MEMBER_NOT_FOUND`

## Frontend

- The project members panel now supports:
  - inline role editing
  - member removal
- Self-downgrade from `PROJECT_MANAGER` to `TEAM_MEMBER` removes member-management controls after the detail capability refresh.
- Self-removal redirects non-admin users back to the workspace root because the project is no longer visible.

## Deferred Boundary

- Removed-member task labeling remains deferred because task read models are still not implemented in the current branch stack.

## Validation

- Backend: `39 passed`
  - `pytest tests/integration/test_projects_api.py`
- Frontend: `27 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx`

## Next Useful Step

- Move to the next unblocked Wave 2 leftover outside memberships, which is currently `US-042` only if `US-040` is delivered first; otherwise Wave 2 is effectively complete for the implemented local dependency chain.
