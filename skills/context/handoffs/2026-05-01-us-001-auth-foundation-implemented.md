# US-001 Auth Foundation Implemented

## Current State

- The first valid implementation slice from the dependency chain is now implemented for `US-001`.
- The local story file `issues/stories/us-001-user-login.md` was refined into an execution slice and moved to suggested status `implemented`.
- Backend now has:
  - custom `users.User` model with the auth-state fields required by the spec
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - generic `INVALID_CREDENTIALS` handling for invalid, inactive, and soft-deleted login attempts
  - CSRF-protected login
  - `GET /auth/me` issuing a CSRF cookie for SPA bootstrap
- Frontend now has:
  - shared API client foundation with credentialed requests and structured error parsing
  - session bootstrap gate
  - `/login` route
  - guarded reset-required shell route at `/reset-password`
  - minimal authenticated shell route at `/`
- GitHub issue `#6` (`[US-001] User Login`) is labeled `implemented` and has an execution summary comment.

## Next Recommended Step

- Start `US-002 Forced First-Login Password Reset` on top of the new auth foundation.
- Reuse the existing session bootstrap and reset-required route guard instead of creating a second auth entry flow.
- Keep `US-003 Logout`, `US-004 Session Expiration`, and `US-057 CSRF Protection` scoped as follow-up stories rather than reopening `US-001`.

## Risks Or Open Questions

- The backend repo-local `.venv` launcher is broken because it points at a missing Windows Store Python 3.12 path. Backend verification succeeded by using `C:\\Users\\vents\\AppData\\Local\\Programs\\Python\\Python310\\python.exe` with `PYTHONPATH` pointed at `backend\\.venv\\Lib\\site-packages` and `backend`.
- Frontend `vite` and `vitest` runs can fail inside the sandbox with `spawn EPERM` because esbuild cannot start its helper process there. Use escalated execution for frontend build and test commands when needed.
- Rate limiting for auth endpoints is still not implemented. That belongs to `US-058`, not this slice.
- Logout and session expiration are still intentionally absent.

## Relevant Files

- `issues/stories/us-001-user-login.md`
- `backend/apps/users/models.py`
- `backend/apps/users/domain/services.py`
- `backend/apps/users/api/views.py`
- `backend/tests/integration/test_auth_api.py`
- `frontend/src/api/client.ts`
- `frontend/src/app/router/createAppRouter.tsx`
- `frontend/src/features/auth/`
- GitHub issue `#6`
