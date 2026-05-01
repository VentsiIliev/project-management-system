# US-008 - Deactivate User

## What Changed

- Reused the existing admin user update contract for deactivation instead of adding a new route.
- `PATCH /api/admin/users/{user_id}` with `{"is_active": false}` now revokes the target user's existing authenticated sessions.
- Deactivation remains distinct from soft delete: the user record stays present and `deleted_at` remains `NULL`.

## Implementation Notes

- Session revocation is handled in `backend/apps/users/domain/services.py` inside the `users` domain, not in the view.
- The service only revokes sessions on an active -> inactive transition.
- The existing login contract stays unchanged: deactivated users still receive the generic `INVALID_CREDENTIALS` response on new login attempts.

## Validation

- `py -3.12 -m pytest tests/integration/test_auth_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `43 passed`

## Boundaries

- No new frontend admin route surface was added.
- No new deactivate-specific endpoint was added.
- No soft-delete behavior was added or changed.
- No task-assignment mutation was introduced; the historical-assignment rule remains preserved by keeping deactivation to `is_active` only.
