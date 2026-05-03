# US-007 - Reset User Password

## Metadata

- Area: 2. Admin User Management
- GitHub labels: `user-story`, `mvp`, `area:admin`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-005`
- Parallelization note: Start after `US-005`; this story extends the same admin user API surface and shares the password-validation contract from `US-002` and `US-005`.

## User Story

**As an** Admin  
**I want** to reset a user's password  
**So that** the user can recover access.

## Acceptance Criteria

**Given** I am an Admin  
**When** I set a valid temporary password for a user  
**Then** the system updates the password and sets `must_reset_password = true`.

**Given** the temporary password violates password policy  
**When** I submit the reset request  
**Then** the system rejects the request.

## Execution Breakdown

### Backend Slice

- [x] Add admin-only `POST /api/admin/users/{user_id}/reset-password` under the owning `users` module.
- [x] Accept only `new_temporary_password` in the request body.
- [x] Validate the temporary password against the existing password policy.
- [x] Update the stored password hash and set `must_reset_password = true`.
- [x] Treat soft-deleted or missing users as not found.
- [x] Keep password-reset rules in `apps/users/domain/services.py` and keep the view thin.
- [x] Preserve the target user's existing authenticated sessions after the admin reset, matching the spec rule that reset does not immediately log them out.

### Frontend Slice

- [x] No frontend implementation in this slice.
- [x] Keep the story backend-only until the admin user-management UI has an owned route surface.

### Test Slice

- [x] Add integration coverage for successful admin password reset.
- [x] Add integration coverage for password-policy rejection on `new_temporary_password`.
- [x] Add permission coverage showing non-admin users cannot reset another user's password.
- [x] Add integration coverage showing soft-deleted targets return not found.
- [x] Add integration coverage proving the new password works on the next login and requires a forced reset.
- [x] Add integration coverage proving an already-authenticated target session remains valid after the admin reset.

## Dependencies And Notes

- Reuse the existing `validate_user_password()` domain helper and map its field errors onto `new_temporary_password`.
- Reuse the existing admin-only permission boundary instead of creating a second admin auth path.
- This story should not implement:
  - frontend admin reset screens
  - logout or session-expiration changes
  - user deactivation semantics from `US-008`
  - forced-reset submission flow for the target user, which is already covered by `US-002`

## Definition Of Done

- `POST /api/admin/users/{user_id}/reset-password` exists and is admin-only.
- Valid temporary passwords update the stored password and set `must_reset_password = true`.
- Invalid temporary passwords return a structured `VALIDATION_ERROR` on `new_temporary_password`.
- Soft-deleted users cannot be reset through this endpoint.
- The reset password can be used for the next login, and that login requires the forced-reset flow.
- Existing authenticated sessions for the target user are not immediately invalidated by the admin reset.
