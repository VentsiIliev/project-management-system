# US-008 - Deactivate User

## Metadata

- Area: 2. Admin User Management
- GitHub labels: `user-story`, `mvp`, `area:admin`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-005`
- Parallelization note: Start after `US-005`; this story reuses the existing admin user update API from `US-006` and should not invent a second deactivation transport path.

## User Story

**As an** Admin  
**I want** to deactivate users  
**So that** they can no longer access the system.

## Acceptance Criteria

**Given** I am an Admin  
**When** I deactivate a user  
**Then** the user can no longer create new sessions.

**Given** the deactivated user has existing assignments  
**When** tasks are viewed  
**Then** historical assignments remain visible.

## Execution Breakdown

### Backend Slice

- [x] Reuse `PATCH /api/admin/users/{user_id}` with `{"is_active": false}` as the deactivation contract.
- [x] Keep deactivation rules in `apps/users/domain/services.py` and keep the view thin.
- [x] Revoke the target user's existing authenticated sessions when they transition from active to inactive.
- [x] Keep deactivation distinct from soft delete: do not set `deleted_at`, do not remove the user record, and do not mutate assignment references.
- [x] Treat soft-deleted or missing users as not found.

### Frontend Slice

- [x] No frontend implementation in this slice.
- [x] Keep the story backend-only until the admin user-management UI has an owned route surface.

### Test Slice

- [x] Add integration coverage showing an admin can deactivate a user through the update endpoint.
- [x] Add integration coverage showing deactivated users cannot create new sessions.
- [x] Add integration coverage showing an already-authenticated target session is revoked after deactivation.
- [x] Add permission coverage showing non-admin users cannot deactivate another user.
- [x] Add integration coverage showing deactivation does not soft-delete the user record.
- [x] Keep the historical-assignment guarantee as a boundary check in this slice: no code path should touch task-assignment data.

## Dependencies And Notes

- Reuse the existing admin-only permission boundary and `AdminUserSerializer` response shape from `US-006`.
- Reuse the existing generic invalid-credentials login response for inactive users from `US-001`.
- This story should not implement:
  - a new `/api/admin/users/{user_id}/deactivate` endpoint
  - frontend admin user-management screens
  - soft delete or hard delete semantics
  - assignment reassignment or task cleanup behavior

## Definition Of Done

- Admin deactivation is performed through `PATCH /api/admin/users/{user_id}` with `is_active = false`.
- Deactivated users cannot create new sessions.
- Existing authenticated sessions for the target user are revoked.
- The user record remains present and not soft-deleted after deactivation.
- Non-admin users cannot deactivate users.
- The implementation does not mutate assignment references or introduce task-side effects.
