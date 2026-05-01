# US-002 - Forced First-Login Password Reset

## Metadata

- Area: `1. Authentication and Session Management`
- GitHub labels: `user-story`, `mvp`, `area:auth`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Slice type: auth follow-up on top of the login foundation
- Parallelization note: Start once dependencies are done; run in parallel only with stories that do not need the same auth contract changes.

## User Story

**As a** newly created user  
**I want** to reset my temporary password on first login  
**So that** only I know my long-term password.

### Acceptance Criteria

**Given** my account has `must_reset_password = true`  
**When** I log in successfully  
**Then** I am redirected to the password reset screen.

**Given** I am on the forced password reset screen  
**When** I submit a valid new password  
**Then** the system updates my password and sets `must_reset_password = false`.

**Given** I have not completed the forced password reset  
**When** I attempt to access any main application page  
**Then** the system blocks access and redirects me back to password reset.

## Dependency Slice Required Before US-002

Build and validate only the auth foundation required to make `US-002` buildable.

This prerequisite slice is accepted through `US-001`, but it exists specifically to unblock the forced-reset story without leaking into logout, session-expiration, admin CRUD, or project and task work.

### Out Of Scope For This Dependency Slice

- forced password reset submission endpoint
- forced password reset form submission
- logout endpoint or UI
- session expiration behavior
- admin user CRUD
- project, membership, task, notification, or comment flows

## Execution Breakdown

### Backend Slice

- [x] Confirm the custom `users` app owns the auth-state fields required by `US-002`:
  - `is_active`
  - `deleted_at`
  - `must_reset_password`
  - `last_login_at`
- [x] Configure Django to use the custom email-based auth model.
- [x] Implement and validate the auth contract under the owning `users` module:
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- [x] Return structured API errors for invalid credentials and unauthenticated session fetches.
- [x] Enforce active and non-deleted user checks before creating sessions.
- [x] Return session profile data needed by the frontend shell:
  - `id`
  - `email`
  - `name`
  - `is_admin`
  - `must_reset_password`
- [x] Expose reset-required session state through login and session bootstrap so the frontend can gate `US-002`.
- [x] Add a shared backend permission baseline so reset-required users are blocked from normal protected API endpoints unless an endpoint explicitly opts out.
- [ ] Implement the forced password reset submission endpoint in the follow-up `US-002` delivery slice.

### Frontend Slice

- [x] Build guarded auth-shell behavior for:
  - unauthenticated users
  - authenticated users
  - authenticated reset-required users
- [x] Add a shared API client foundation that:
  - centralizes the API base URL
  - includes credentials on requests
  - parses structured API errors
  - provides one place for later CSRF and auth response handling
- [x] Add the login screen and session bootstrap flow.
- [x] Route reset-required users into a dedicated shell state instead of the main application shell.
- [x] Keep the reset-required route as a placeholder shell only. Do not add password reset submission yet.
- [ ] Implement the forced password reset form and submission behavior in the follow-up `US-002` delivery slice.

### Test Slice

- [x] Backend tests cover:
  - successful login
  - invalid credentials
  - inactive user rejection
  - soft-deleted user rejection
  - reset-required login response
  - authenticated session bootstrap
  - unauthenticated session bootstrap
  - reset-required session bootstrap payload
  - reset-required user rejection on protected endpoints
- [x] Frontend tests cover:
  - successful login transition into authenticated shell
  - invalid credential error presentation
  - existing session bootstrap into authenticated shell
  - reset-required session routing into the blocked shell state
- [x] Keep the auth test scaffolding reusable for the actual `US-002` implementation slice.
- [ ] Add tests for the password reset submission and main-app blocking behavior when the actual `US-002` flow is implemented.

## Dependencies And Parallel Work

### Dependency Notes

- `US-002` depends directly on `US-001` because the forced-reset flow requires a working session and login contract first.
- The backend login/session contract must already expose `must_reset_password` before the frontend can route users into the reset-required shell.
- The guarded reset-required shell is a prerequisite, but it is not the full `US-002` implementation.
- `US-003 Logout`, `US-004 Session Expiration`, `US-057 CSRF Protection`, and `US-058 Rate-Limit Authentication Endpoints` should remain separate follow-up stories rather than expanding this slice.

### Parallel Work

- Once the auth foundation slice is passing, the forced-reset submission endpoint and the forced-reset UI can be developed in parallel if they keep the response contract explicit.
- Stories that only need authenticated shell presence may start after this dependency slice passes, but they must not assume logout, session expiry, or admin user management already exist.

## Definition Of Done For This Dependency Slice

- The custom backend user model exists and is the active Django auth user model.
- `POST /api/auth/login` creates a session only for valid active non-deleted users and returns the expected session payload.
- `GET /api/auth/me` returns the authenticated session user payload or an unauthenticated error envelope.
- The backend default permission baseline blocks reset-required users from normal protected API endpoints while still allowing the auth bootstrap flow to function.
- Invalid, inactive, and soft-deleted login attempts all return the same generic invalid-credentials error shape.
- Successful login updates `last_login_at`.
- Frontend boots through session lookup and shows either:
  - login page
  - authenticated shell
  - reset-required shell state
- The reset-required shell state blocks normal application entry even though the actual password reset submission flow is not implemented yet.
- Backend and frontend automated tests for the dependency slice pass.
- Scope remains limited to the auth foundation required to make `US-002` buildable.

## Open Blockers Or Follow-Ups

- Rate limiting and richer auth observability remain follow-up work under their own stories.

## Actual US-002 Delivery Slice

Implement only the forced first-login password reset behavior on top of the completed auth foundation.

### Backend Slice

- [x] Add `POST /api/auth/force-reset-password` under the `users` module.
- [x] Allow reset-required authenticated users to access this endpoint while keeping the default protected-endpoint block in place.
- [x] Validate the new password with Django's built-in password validators.
- [x] Reject invalid submissions with the repository error envelope and field-level details.
- [x] Update the authenticated user's password and set `must_reset_password = false` on success.
- [x] Return the refreshed session user payload needed by the frontend shell.
- [x] Add backend tests for:
  - successful forced reset
  - invalid new password
  - unauthenticated forced reset rejection
  - non-reset-required user behavior on the forced-reset endpoint
  - protected-endpoint access after successful forced reset

### Frontend Slice

- [x] Replace the reset-required placeholder shell with an actual forced-reset form.
- [x] Add client-side validation aligned to the backend contract where useful, without duplicating all backend password rules.
- [x] Submit the new password to `POST /api/auth/force-reset-password`.
- [x] Surface validation and server error states clearly on the reset page.
- [x] Update the cached session state from the successful reset response.
- [x] Redirect the user into the authenticated shell after the forced reset succeeds.
- [x] Keep `/login` and `/reset-password` route guard behavior aligned with the updated session state.

### Test Slice

- [x] Extend backend auth integration tests for the forced-reset endpoint and post-reset access behavior.
- [x] Extend frontend auth flow tests for:
  - successful password reset submission
  - validation or server-error presentation
  - redirect into the authenticated shell after success
- [x] Run the smallest meaningful backend and frontend auth test sets for this story.

### Out Of Scope For This Delivery Slice

- normal change-password flow (`POST /auth/change-password`)
- logout
- session expiration
- admin password reset for other users
- rate limiting beyond the existing story boundary
