# US-005 Create User

## Scope Landed

- Added `POST /api/admin/users` in the `users` module.
- Delivery is intentionally backend-only for this story slice because the app still has no owned admin route surface.
- The endpoint returns a stable created-user payload:
  - `id`
  - `email`
  - `name`
  - `is_active`
  - `is_admin`
  - `must_reset_password`

## Domain Rules

- Only admins may create users.
- New users are created with:
  - normalized lowercase email
  - hashed password
  - `must_reset_password = true`
  - `is_admin = false`
- `is_active` defaults to `true` unless explicitly supplied otherwise.

## Reusable Backend Pattern

- The shared `validate_user_password()` helper in `apps.users.domain.services` now accepts a `field_name`.
- Forced-reset still reports password-policy errors on `new_password`.
- Admin create-user reports password-policy errors on `temporary_password`.
- Duplicate email handling stays in the domain service and is mapped back to a structured `VALIDATION_ERROR` envelope in the API view.

## Tests Added

- admin can create a user with a temporary password
- duplicate email returns a structured validation error
- non-admin users are denied
- temporary password is validated against the password policy

## Branch Context

- Branch: `us-005-create-user`
- Stack base: `us-004-session-expiration` / PR `#82`
- Keep the unrelated `.gitignore` change untouched.
- Keep the older untracked `2026-05-01-auth-story-stack-through-us-003.md` note out of future PRs unless it is intentionally added.
