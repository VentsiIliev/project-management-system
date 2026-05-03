# US-055 - Enforce Backend Authorization

## Metadata

- Area: 17. Authorization and Security
- GitHub labels: `user-story`, `mvp`, `area:security`
- Suggested status: `implemented`
- Suggested wave: `Wave 0`
- Depends on: `US-001`
- Parallelization note: This should be the last Wave 0 cleanup slice before deeper task work. Size it as an authorization audit over the currently implemented endpoint surface, not as a rewrite of future modules.

## User Story

**As a** system  
**I want** every implemented API endpoint to enforce permissions server-side  
**So that** hidden frontend actions cannot bypass security.

## Acceptance Criteria

**Given** a user sends a request to any currently implemented protected endpoint  
**When** the request is processed  
**Then** the backend verifies authentication, account state, project visibility, project membership, role, and requested action as applicable to that endpoint.

**Given** frontend UI hides an action  
**When** a user calls the implemented API directly  
**Then** backend permissions are still enforced with the correct `403` or `404` behavior.

**Given** an Admin performs an implemented action  
**When** the action is allowed by the current story scope  
**Then** admin override still works without bypassing core invariants already owned by those modules.

## Current Slice Notes

- Much of this story is already partially satisfied by the auth, admin-user, project, membership, and task-create slices.
- The remaining work is to audit the currently implemented endpoint surface, close any missing checks, and add the missing test matrix.
- Do not pull future task-detail, dependency, activity-log, comment, or notification endpoints into this story.

## Execution Breakdown

### Audit Scope

- [x] Enumerate the currently implemented protected endpoint surface only:
  - auth session endpoints already in repo
  - admin user create, update, and reset-password endpoints
  - project create, list, detail, edit, delete, member-management, and task-create endpoints
- [x] For each endpoint, confirm:
  - unauthenticated requests are rejected
  - inactive or soft-deleted accounts are rejected according to the existing auth contract
  - project-scoped visibility uses `404` when the resource should be hidden
  - role-restricted mutations use the correct `403` permission error when the resource is visible but the action is forbidden

### Backend Slice

- [x] Close any missing permission checks in the owning modules instead of creating a fake shared authorization layer.
- [x] Reuse existing policy and selector boundaries inside `users`, `projects`, and `tasks`.
- [x] Keep admin override behavior aligned with the current implemented story scopes.
- [x] Do not introduce broad speculative abstractions for future modules that do not exist yet.

### Frontend Slice

- [x] Keep the backend as source of truth.
- [x] Only add frontend adjustments where an already-implemented screen is missing a denied or unavailable state for a backend rejection that now exists.
- [x] Do not create new admin UI route surfaces in this story.

### Test Slice

- [x] Add a permission matrix across the currently implemented endpoint surface.
- [x] Cover these actor states where relevant:
  - unauthenticated user
  - inactive user
  - Admin
  - active `PROJECT_MANAGER`
  - active `TEAM_MEMBER`
  - non-member
  - removed member
- [x] Add regression coverage for the `403` vs `404` exposure boundary on project-scoped endpoints.
- [x] Add regression coverage for direct API calls to actions the frontend already hides.

## Implementation Result

- Hardened the shared backend permission boundary so account-state failures and role failures are separated more clearly in `apps/users/api/permissions.py`.
- Hardened project visibility and project/task mutation policies so they return no access for anonymous, inactive, soft-deleted, or reset-required actors even if a future view forgets to enforce the normal permission class.
- Added integration coverage for:
  - unauthenticated access to implemented admin, project, and task endpoints
  - inactive-session access to those same protected surfaces
  - reset-required access to protected project and task surfaces
  - the existing direct API permission boundaries already enforced on project-scoped actions

## Dependencies And Notes

- This story should follow the already-landed auth, project, membership, and task-metadata foundations.
- This story should not attempt to centralize all future authorization into one new module unless a real duplication problem appears during the audit.
- The current repo already exposes capability flags such as `can_edit`, `can_delete`, and `can_manage_members` on project detail reads. Those should remain derived from backend truth, not become the authorization source.

## Definition Of Done

- Every currently implemented protected endpoint has explicit server-side authorization coverage.
- The permission matrix for implemented actors and actions is covered by integration tests.
- Project-scoped endpoint behavior consistently uses the intended `403` vs `404` boundary.
- Any gaps discovered during the audit are fixed in the owning modules without broad speculative refactors.
