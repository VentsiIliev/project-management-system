# US-006 Update User

## Scope Landed

- Added admin-only `PATCH /api/admin/users/{user_id}` in the `users` module.
- Delivery is intentionally backend-only for this story slice because the app still has no owned admin user-management UI route surface.
- The endpoint reuses the same admin-user response payload returned by `POST /api/admin/users`.

## Domain Rules

- Only admins may update users through this endpoint.
- Only these fields are writable:
  - `name`
  - `email`
  - `is_active`
- Updated email values are normalized to lowercase before saving.
- Duplicate emails are rejected across active and soft-deleted users.
- Soft-deleted users are treated as not found for update operations.

## Reusable Backend Pattern

- `UpdateUserSerializer` explicitly rejects unsupported input fields instead of silently ignoring them.
- `update_user_account()` owns normalization, duplicate-email checks, record lookup, and persistence.
- Admin create and update now share the same `AdminUserSerializer` payload, which keeps the admin-user write surface consistent while list/detail read endpoints do not exist yet.

## Tests Added

- admin can update `name`, `email`, and `is_active`
- duplicate email returns a structured validation error
- unsupported fields are rejected without mutating the user
- non-admin users are denied
- soft-deleted targets return not found
- deactivated users still cannot log in after the admin update

## Branch Context

- Branch: `us-006-update-user`
- Stack base: `us-005-create-user` / PR `#83`
- Keep the unrelated `.gitignore` change untouched.
- Keep the older untracked `2026-05-01-auth-story-stack-through-us-003.md` note out of future PRs unless it is intentionally added.
