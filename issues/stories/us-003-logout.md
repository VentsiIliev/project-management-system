# US-003 - Logout

## Metadata

- Area: `1. Authentication and Session Management`
- GitHub labels: `user-story`, `mvp`, `area:auth`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Slice type: auth session termination on top of the existing session-based login flow
- Parallelization note: Start once the auth foundation is in place. Keep session expiration, rate limiting, and broader shell features out of scope.

## User Story

**As a** user  
**I want** to log out  
**So that** my session is ended securely.

### Acceptance Criteria

**Given** I am authenticated  
**When** I log out  
**Then** the system invalidates my current session.

**Given** I have logged out  
**When** I attempt to access a protected page  
**Then** I am redirected to login.

## Execution Breakdown

### Backend Slice

- [x] Add `POST /api/auth/logout` under the `users` auth API.
- [x] Allow authenticated users to call logout even when `must_reset_password = true`.
- [x] Invalidate the current Django session and clear the session cookie through the normal logout flow.
- [x] Return a simple success response that keeps the frontend contract explicit and does not add extra workflow meaning.
- [x] Return the repository unauthenticated error envelope when logout is called without an active session.
- [x] Keep logout transport logic in the API layer and session invalidation behavior in the `users` domain service.

### Frontend Slice

- [x] Add shared logout API support to the auth feature.
- [x] Add a logout mutation that clears the cached session state on success.
- [x] Expose logout from the authenticated shell.
- [x] Expose logout from the reset-required shell so forced-reset users can still end their session.
- [x] Redirect the user to `/login` after successful logout.
- [x] Keep protected-route behavior driven by the session query instead of duplicating auth state.

### Test Slice

- [x] Backend tests cover:
  - successful logout for an authenticated user
  - protected endpoint rejection after logout
  - logout for a reset-required authenticated user
  - unauthenticated logout rejection
- [x] Frontend tests cover:
  - logout from the authenticated shell
  - logout from the reset-required shell
  - redirect back to login after logout
  - CSRF attachment on the logout request
- [x] Run the focused backend and frontend auth test sets for this story.

## Dependencies And Parallel Work

### Dependency Notes

- `US-003` depends on the existing session-based auth foundation from `US-001`.
- The endpoint contract must remain compatible with the shared API client and current session query behavior.
- Logout must remain separate from `US-004 Session Expiration`; this slice only handles explicit user-initiated session termination.
- Because the current working branch already contains the forced-reset flow, this implementation must preserve the security rule that reset-required users may access `/auth/logout`.

### Parallel Work

- Backend and frontend implementation can proceed in parallel once the logout response contract is fixed.
- Session expiration handling, idle timeout UX, and auth rate limiting are follow-up stories and should not be folded into this slice.

## Definition Of Done

- `POST /api/auth/logout` exists and terminates the current session for authenticated users.
- Calling logout without an active session returns the structured unauthenticated error envelope.
- Authenticated users in both the normal shell and reset-required shell can log out.
- After logout, the frontend cached session becomes unauthenticated and protected routes resolve to `/login`.
- Backend and frontend automated tests for the logout flow pass.
- Scope remains limited to explicit logout and does not implement session expiration, idle timeout warnings, or other auth stories.

## Open Blockers Or Follow-Ups

- `US-004 Session Expiration` should own timeout-driven logout behavior and expired-session UX.
- Auth endpoint rate limiting remains tracked separately under the auth hardening stories.
