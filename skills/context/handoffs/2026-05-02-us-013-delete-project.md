# US-013 - Delete Project With Confirmation

## Delivered Slice

- Added `DELETE /api/projects/{project_id}` with the spec confirmation flag `confirm_project_delete: true`.
- Soft-delete currently cascades through:
  - the project row
  - active project memberships on that project
- Deleted projects now disappear from normal project list and detail reads because the existing active managers/selectors already exclude soft-deleted projects.
- Frontend project detail now includes a real destructive delete panel with the exact confirmation copy:
  - `I understand this will soft-delete this project and its memberships.`

## Important Boundaries

- The spec also mentions task, subtask, and activity-log preservation, but those modules are not implemented in the current branch stack yet.
- `US-013` intentionally stops at project and membership soft-delete and records the deeper cascade as a deferred dependency in `issues/review-findings.md`.

## Validation

- Backend: `22 passed`
  - `pytest tests/integration/test_projects_api.py`
- Frontend: `24 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx`

## Next Useful Step

- Continue with `US-014 Add Project Member`, which can now assume the project workspace has create, view, edit, and delete behavior in place.
