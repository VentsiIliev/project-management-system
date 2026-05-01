# US-001 - User Login

## Metadata

- Area: `1. Authentication and Session Management`
- GitHub labels: `user-story`, `mvp`, `area:auth`
- Suggested status: `implemented`
- Suggested wave: `Wave 0`
- Depends on: none
- Slice type: auth foundation

## User Story

**As a** user  
**I want** to log in with my email and password  
**So that** I can access the project management application.

## Acceptance Criteria

**Given** I am an active, non-deleted user  
**When** I submit valid email and password credentials  
**Then** the system creates a session and returns my user profile.

**Given** my credentials are invalid  
**When** I attempt to log in  
**Then** the system returns a generic invalid credentials error.

**Given** my account is inactive or soft-deleted  
**When** I attempt to log in  
**Then** the system returns a generic invalid credentials error.

**Given** I am required to reset my password  
**When** I log in successfully  
**Then** the response indicates that password reset is required.

## First Valid Implementation Slice

Build only the auth foundation needed to make `US-001` executable.

### Out Of Scope For This Slice

- Forced password reset submission flow
- Logout endpoint or UI
- Session expiration behavior
- Admin user CRUD
- Project, membership, task, notification, or comment flows

## Execution Breakdown

### Backend Slice

- [x] Add the `users` app implementation scaffold with a custom Django user model that owns:
  - UUID primary key
  - `email`
  - `name`
  - `is_active`
  - `is_admin`
  - `must_reset_password`
  - `last_login_at`
  - `deleted_at`
  - created and updated timestamps
- [x] Configure Django to use the custom user model and email-based authentication.
- [x] Add a backend auth API under the owning `users` module for:
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- [x] Return structured API errors for auth failures using the repository error envelope.
- [x] Enforce active and non-deleted user checks before session creation.
- [x] Update `last_login_at` on successful login.
- [x] Return session profile data needed by the frontend shell:
  - `id`
  - `email`
  - `name`
  - `is_admin`
  - `must_reset_password`
- [x] Keep views thin by putting auth rules in `apps/users/domain/`.
- [x] Add backend tests for:
  - successful login
  - invalid credentials
  - inactive user login rejection
  - soft-deleted user login rejection
  - current-user fetch for authenticated user
  - unauthenticated current-user fetch

### Frontend Slice

- [x] Replace the health-check scaffold home page with an auth-aware app shell.
- [x] Add a shared API client foundation that:
  - centralizes the API base URL
  - includes credentials on requests
  - parses structured API errors
  - provides one place for later CSRF and auth response handling
- [x] Add an `auth` feature with:
  - login form page
  - session bootstrap query
  - auth state shell for loading, authenticated, and unauthenticated states
- [x] Route unauthenticated users to the login screen.
- [x] Surface generic invalid credential errors without revealing account state.
- [x] Persist only the session state needed for the current shell. Do not add broader product routes yet.
- [x] Show the logged-in shell with a reset-required banner or state when `must_reset_password = true`.
- [x] Add frontend tests for:
  - successful login transition into authenticated shell
  - invalid credentials message
  - existing session bootstrap into authenticated shell
  - reset-required session shell state

### Test Slice

- [x] Backend tests prove the auth contract for each `US-001` acceptance criterion.
- [x] Frontend tests prove the login page and auth shell behavior against the backend contract shape.
- [x] Keep test scaffolding minimal but reusable for later auth stories.
- [x] Run the smallest meaningful backend and frontend test sets for this slice.

## Dependencies And Parallel Work

### Prerequisites Satisfied By This Slice

- Epic `00-project-setup-and-architecture`
  - shared API contract baseline starts here
  - backend and frontend feature boundaries become real code
- Epic `02-backend-baseline`
  - structured API errors begin here
  - centralized auth rules begin here
- Epic `03-frontend-baseline`
  - shared API client begins here
  - auth shell and session handling begin here
- Epic `04-testing-baseline`
  - backend auth tests and frontend auth flow tests begin here

### Dependency Notes

- Backend auth contract must land before the frontend login flow can fully integrate.
- Frontend can build the auth shell in parallel once the response shape is explicit:
  - success response returns session user data including `must_reset_password`
  - error response returns a generic invalid credentials envelope
- No later story should start from project or task flows before this slice is passing.

## Definition Of Done

- Custom backend user model exists and is the active Django auth user model.
- `POST /api/auth/login` creates a session for valid active non-deleted users and returns the expected session payload.
- `GET /api/auth/me` returns the authenticated session user payload or unauthenticated error.
- Invalid, inactive, and soft-deleted login attempts return the same generic invalid-credentials error shape.
- Successful login updates `last_login_at`.
- Frontend boots through session lookup and shows either:
  - login page
  - authenticated shell
  - reset-required authenticated shell state
- Frontend uses the shared API client foundation rather than feature-local `fetch` calls.
- Backend and frontend automated tests for the slice pass.
- Scope remains limited to `US-001` foundation only.

## Open Blockers Or Unknowns

- Rate limiting is required by the spec for auth endpoints, but it is not part of this first slice unless the baseline scaffold already exists.
- CSRF token attachment for unsafe requests should be designed into the shared client foundation, but the login endpoint can remain the first consumer.
- GitHub issue state should move to `implemented` or `:owner-review` after implementation completes. Do not mark it `done`.
