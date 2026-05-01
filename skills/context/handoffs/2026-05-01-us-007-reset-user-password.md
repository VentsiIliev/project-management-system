# US-007 Reset User Password

## Scope Landed

- Added admin-only `POST /api/admin/users/{user_id}/reset-password` in the `users` module.
- Delivery is intentionally backend-only for this story slice because the app still has no owned admin user-management UI route surface.
- The endpoint reuses the same `AdminUserSerializer` payload already used by admin create and update.

## Domain Rules

- Only admins may reset another user's password through this endpoint.
- The request accepts only `new_temporary_password`.
- The new temporary password is validated against the same password policy used by forced reset and user creation.
- A successful admin reset:
  - updates the stored password hash
  - sets `must_reset_password = true`
  - keeps soft-deleted users out of scope by returning not found

## Session Preservation Pattern

- Django would normally invalidate existing authenticated sessions when a user's password hash changes because session auth hashes no longer match.
- The spec for admin reset explicitly says existing sessions should stay alive until logout or expiry.
- `admin_reset_user_password()` now updates the password and then rewrites `_auth_user_hash` for active sessions belonging to the target user so those sessions remain valid while still seeing `must_reset_password = true` on later requests.

## Tests Added

- admin can reset a user's password
- password-policy failures return `VALIDATION_ERROR` on `new_temporary_password`
- non-admin users are denied
- soft-deleted targets return not found
- old password stops working and the new temporary password logs in with `requires_password_reset = true`
- an already-authenticated target session remains valid after the admin reset

## Branch Context

- Branch: `us-007-reset-user-password`
- Stack base: `us-006-update-user` / PR `#84`
- Keep the unrelated `.gitignore` change untouched.
- Keep the older untracked `2026-05-01-auth-story-stack-through-us-003.md` note out of future PRs unless it is intentionally added.
