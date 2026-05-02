# US-014 - Add Project Member

## Delivered Slice

- Added the spec membership endpoints:
  - `GET /api/projects/{project_id}/members`
  - `POST /api/projects/{project_id}/members`
- Visible project users can read the active member list.
- Only Admins and active `PROJECT_MANAGER` memberships can add members.
- Invalid target users are handled as:
  - missing or soft-deleted -> `USER_NOT_FOUND`
  - inactive -> `VALIDATION_ERROR` on `user_id`
- Re-adding a previously removed member reactivates the soft-deleted membership row and applies the requested role.

## Frontend

- The project workspace now includes a visible members panel on project detail routes.
- Read-only members can view the member list but do not see the add-member form.
- The current frontend uses the spec `user_id` contract directly because there is still no separate user-directory surface in the branch stack.

## Validation

- Backend: `29 passed`
  - `pytest tests/integration/test_projects_api.py`
- Frontend: `25 passed`
  - `npm run test:run -- src/features/projects/ProjectsFlow.test.tsx src/features/auth/AuthFlow.test.tsx`

## Next Useful Step

- Group `US-015 Change Project Member Role` and `US-016 Remove Project Member` into the next reviewable slice because they share the same membership contract, permission rules, and project-members panel.
