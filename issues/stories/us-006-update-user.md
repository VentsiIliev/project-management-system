# US-006 - Update User

## Metadata

- Area: 2. Admin User Management
- GitHub labels: `user-story`, `mvp`, `area:admin`
- Suggested status: `Ready`
- Suggested wave: `Wave 1`
- Depends on: `US-005`
- Parallelization note: Start after `US-005` because this story extends the same admin user API surface.

## User Story

**As an** Admin  
**I want** to update user profile and active status  
**So that** user records remain accurate.

## Acceptance Criteria

**Given** I am an Admin  
**When** I update a user name, email, or active status  
**Then** the system saves the allowed changes.

**Given** I attempt to update unsupported fields  
**When** I submit the request  
**Then** the system rejects unsupported changes.

## Execution Breakdown

### Backend Slice

- [x] Add admin-only `PATCH /api/admin/users/{user_id}` under the owning `users` module.
- [x] Support partial updates for only:
  - `name`
  - `email`
  - `is_active`
- [x] Normalize updated email to lowercase before persistence.
- [x] Reject duplicate email values across active and soft-deleted users.
- [x] Return the same admin-user payload shape already used by `POST /api/admin/users`.
- [x] Keep update rules in `apps/users/domain/services.py` and keep the view thin.
- [x] Treat soft-deleted or missing users as not found.

### Frontend Slice

- [x] No frontend implementation in this slice.
- [x] Keep the story backend-only until the admin user-management UI has an owned route surface.

### Test Slice

- [x] Add integration coverage for successful admin updates of `name`, `email`, and `is_active`.
- [x] Add integration coverage for duplicate-email rejection.
- [x] Add integration coverage for unsupported-field rejection such as `is_admin` or `must_reset_password`.
- [x] Add permission coverage showing non-admin users cannot update users.
- [x] Add regression coverage showing deactivated users still cannot log in after an admin toggles `is_active` to `false`.

## Dependencies And Notes

- `US-005` already established the admin-only create-user surface and reusable admin-user serializer payload. Reuse that contract instead of creating a second response shape.
- This story should not implement:
  - admin password reset
  - soft delete / deactivate endpoint semantics from `US-008`
  - admin list or detail read endpoints
  - admin UI
- Unsupported-field rejection should come from the update serializer contract, not ad hoc view branching.

## Definition Of Done

- `PATCH /api/admin/users/{user_id}` exists and is admin-only.
- Only `name`, `email`, and `is_active` are writable.
- Duplicate emails return a structured `VALIDATION_ERROR`.
- Unsupported fields are rejected and do not mutate the user.
- Soft-deleted users cannot be updated through this endpoint.
- Integration tests cover the acceptance criteria, permissions, and inactive-login regression.
