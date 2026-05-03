# US-058 - Rate-Limit Authentication Endpoints

## Metadata

- Area: 17. Authorization and Security
- GitHub labels: `user-story`, `mvp`, `area:security`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Parallelization note: This slice can build directly on the auth foundation and the CSRF hardening work from `US-057`.

## User Story

**As a** system  
**I want** authentication endpoints to be rate-limited  
**So that** brute-force attempts are reduced.

## Acceptance Criteria

**Given** repeated failed login attempts occur from the same IP or email  
**When** the limit is exceeded  
**Then** the system rate-limits further attempts.

**Given** an authentication failure occurs  
**When** the error is returned  
**Then** the message does not reveal whether the email exists or account is inactive.

## Execution Breakdown

### Backend Slice

- [x] Add cache-backed failure tracking for authentication endpoints under the `users` module.
- [x] Enforce failed-login throttling by both client IP and normalized email.
- [x] Reuse the existing generic `INVALID_CREDENTIALS` login failure for wrong password, inactive user, and missing user.
- [x] Return a structured `RATE_LIMITED` error with HTTP `429` when the threshold is exceeded.
- [x] Apply the same rate-limit pattern to the implemented forced-reset endpoint so the current auth endpoint surface is covered.
- [x] Clear the relevant failure counters after a successful login.

### Frontend Slice

- [x] Keep the shared client and login flow intact.
- [x] Add explicit login-form handling for the `RATE_LIMITED` backend error state.
- [x] Surface a visible rate-limit message without exposing account existence details.

### Test Slice

- [x] Add backend integration coverage showing repeated failed logins from the same email are rate-limited.
- [x] Add backend integration coverage showing repeated failed logins from the same IP are rate-limited.
- [x] Add backend integration coverage proving a successful login clears the accumulated login failure counters.
- [x] Add backend integration coverage showing forced-reset failures are rate-limited on the implemented endpoint surface.
- [x] Keep or add frontend integration coverage showing the login form renders the rate-limit message.

## Dependencies And Notes

- This slice should use the Django cache backend already available in the project instead of introducing external infrastructure-specific middleware.
- This slice should not reveal whether an email exists, whether the account is inactive, or which credential was wrong.
- This slice does not need to implement `/auth/change-password`, which is not yet part of the current repo surface.

## Definition Of Done

- Repeated failed login attempts are rate-limited by both IP and email.
- Successful login clears the relevant login failure counters.
- Implemented authentication endpoints return a structured `RATE_LIMITED` response with HTTP `429` when blocked.
- Generic invalid-credential responses remain generic and non-revealing.
- The frontend login flow shows a clear rate-limit message when the backend returns `RATE_LIMITED`.
