# US-004 Session Expiration

## Scope Landed

- Django session timeout now matches the spec:
  - `SESSION_COOKIE_AGE = 28800`
  - `SESSION_SAVE_EVERY_REQUEST = True`
- Expired sessions continue using the existing structured `UNAUTHENTICATED` response shape.
- Frontend now distinguishes:
  - initial anonymous session bootstrap
  - later `401` responses after an established session

## Reusable Frontend Pattern

- The shared API client now supports `suppressUnauthorizedHandler` for requests that intentionally probe session state.
- `fetchSession()` uses `suppressUnauthorizedHandler: true` so the initial `/auth/me` bootstrap `401` does not get mislabeled as an expired session.
- All later `401` responses still flow through the registered unauthorized handler.
- The handler marks a transient auth UI notice and clears the cached session so routing falls back to `/login`.

## Current Expired-Session UX

- Login shows: `Your session expired after inactivity. Sign in again to continue.`
- Successful login, logout, and forced reset clear the transient auth notice.
- No remember-me behavior, countdown timer, or background polling was added.

## Tests Added

- Backend:
  - session timeout settings match the spec
  - expired session becomes unauthenticated on next request
  - authenticated request refreshes the session timeout cookie
- Frontend:
  - initial anonymous bootstrap does not show an expired-session notice
  - later post-login `401` returns to login with the expired-session notice

## Branch Context

- Branch: `us-004-session-expiration`
- Stack base: `us-003-logout` / PR `#81`
- Keep the unrelated `.gitignore` change untouched.
