# US-057 - CSRF Protection

## Metadata

- Area: 17. Authorization and Security
- GitHub labels: `user-story`, `mvp`, `area:security`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Parallelization note: This slice builds on the existing session-auth foundation and can run independently of rate limiting.

## User Story

**As a** system  
**I want** unsafe authenticated requests to require CSRF protection  
**So that** session-based authentication is protected.

## Acceptance Criteria

**Given** a user submits POST, PATCH, PUT, or DELETE  
**When** the CSRF token is missing or invalid  
**Then** the request is rejected.

**Given** the CSRF token is valid  
**When** the unsafe request is submitted  
**Then** normal authentication and authorization checks continue.

## Execution Breakdown

### Backend Slice

- [x] Keep CSRF enforcement on all unsafe session-auth endpoints already using Django session authentication.
- [x] Add explicit integration coverage for unsafe authenticated endpoints beyond login:
  - logout
  - forced password reset
  - admin user-management mutation
  - project creation mutation
- [x] Complete production cookie settings to match the spec:
  - `SESSION_COOKIE_SECURE = True`
  - `SESSION_COOKIE_HTTPONLY = True`
  - `SESSION_COOKIE_SAMESITE = "Lax"`
  - `CSRF_COOKIE_SECURE = True`
  - `CSRF_COOKIE_HTTPONLY = False`
  - `CSRF_COOKIE_SAMESITE = "Lax"`

### Frontend Slice

- [x] Keep the shared API client as the single CSRF attachment boundary for unsafe requests.
- [x] Add or keep focused UI-level coverage proving unsafe auth and project mutations send `X-CSRFToken` and credentials.
- [x] No new visible UI surface is required in this slice.

### Test Slice

- [x] Add backend integration tests proving unsafe requests are rejected without a valid CSRF token.
- [x] Add backend integration tests proving the same requests succeed when the token is present and the underlying auth or permission check passes.
- [x] Keep frontend tests proving the shared client sends the CSRF token on login, logout, forced reset, and project creation.

## Dependencies And Notes

- This story should not change the existing auth UX flows.
- This story should not introduce custom CSRF middleware when Django session authentication already provides the correct enforcement path.
- Reuse the shared frontend API client rather than attaching tokens ad hoc in feature code.

## Definition Of Done

- Unsafe session-authenticated requests are rejected without a valid CSRF token.
- The same requests proceed normally when the CSRF token is valid.
- Production cookie settings match the session and CSRF requirements from the spec.
- Frontend unsafe requests continue to send the CSRF token and credentials through the shared API client.
