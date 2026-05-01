# Auth Session And CSRF Bootstrap

## Context

- The first executable auth slice had to support Django session login from a React SPA without adding off-spec endpoints.
- The product spec requires:
  - session-based auth
  - `POST /auth/login`
  - `GET /auth/me`
  - CSRF handling for login
  - route guarding for reset-required users

## Decision

- Use `GET /api/auth/me` as the single session bootstrap endpoint for the SPA.
- Decorate `GET /api/auth/me` with `ensure_csrf_cookie` so the frontend can obtain the CSRF cookie before sending `POST /api/auth/login`.
- Decorate `POST /api/auth/login` with explicit CSRF protection.
- Keep the frontend shared API client responsible for attaching `X-CSRFToken` on unsafe requests from `document.cookie`.
- Treat authenticated but inactive or soft-deleted session users as unauthenticated on `GET /api/auth/me` and clear them through backend logout behavior in the service layer.

## Rationale

- This stays aligned with the spec endpoint names instead of inventing a separate CSRF/bootstrap endpoint.
- It keeps the auth shell thin and reusable for later stories.
- It closes the gap between backend CSRF enforcement and frontend request behavior at the foundation layer, rather than patching it later in `US-057`.

## Consequences

- Positive:
- Later auth stories can build on one clear bootstrap contract.
- Frontend login flow already exercises the same CSRF path that later unsafe requests can reuse.
- Session truth remains backend-owned.

- Negative:
- `GET /auth/me` now has two responsibilities: session introspection and CSRF cookie issuance.
- Frontend tests that assert CSRF behavior need to seed `document.cookie` explicitly.

## Related Files Or Issues

- `backend/apps/users/api/views.py`
- `backend/apps/users/domain/services.py`
- `backend/tests/integration/test_auth_api.py`
- `frontend/src/api/client.ts`
- `frontend/src/features/auth/AuthFlow.test.tsx`
- `issues/stories/us-001-user-login.md`
- `issues/stories/us-002-forced-first-login-password-reset.md`
- `issues/stories/us-057-csrf-protection.md`
