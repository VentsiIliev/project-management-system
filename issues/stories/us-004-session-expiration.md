# US-004 - Session Expiration

## Metadata

- Area: 1. Authentication and Session Management
- GitHub labels: `user-story`, `mvp`, `area:auth`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Builds on implemented auth stack: `US-002`, `US-003`

## User Story

**As a** user  
**I want** inactive sessions to expire  
**So that** my account is protected when I stop using the app.

## Acceptance Criteria

**Given** I have been inactive for 8 hours  
**When** I make another authenticated request  
**Then** the system treats me as unauthenticated.

**Given** I continue using the application  
**When** I make authenticated requests  
**Then** my session inactivity timer is refreshed.

## Execution Breakdown

### Backend slice

- [x] Set Django session inactivity settings to match the spec:
  - `SESSION_COOKIE_AGE = 28800`
  - `SESSION_SAVE_EVERY_REQUEST = True`
- [x] Keep expired sessions surfacing through the existing structured unauthenticated behavior instead of introducing a second auth error shape.
- [x] Leave password-reset enforcement, logout behavior, and rate limiting unchanged in this slice.

### Frontend slice

- [x] Keep the existing session bootstrap flow as the source of truth for route guards.
- [x] Distinguish initial unauthenticated bootstrap from an already-established session expiring during later API activity.
- [x] When a later authenticated request returns `401`, clear session state and show an expired-session message on the login screen.
- [x] Do not add remember-me behavior, idle countdown UI, or background polling in this slice.

### Test slice

- [x] Add backend integration coverage that expired sessions are treated as unauthenticated on the next request.
- [x] Add backend coverage that authenticated activity refreshes session timeout behavior.
- [x] Add frontend auth-flow coverage that a post-login `401` returns the user to `/login` with an expired-session message.
- [x] Re-run the focused auth backend and frontend test suites.

## Dependency And Sequencing Notes

- This story depends on the session auth foundation from `US-001`.
- It should stay stacked on top of the current auth branch chain because the frontend route shell from `US-001` through `US-003` is the surface being updated.
- This story is intentionally separate from:
  - `US-003` logout
  - `US-058` auth endpoint rate limiting
  - admin user CRUD
  - project, task, comment, or notification flows

## Definition Of Done

- Django session settings enforce the spec's 8-hour inactivity timeout with refresh-on-use behavior.
- Expired sessions are treated as unauthenticated without breaking the existing forced-reset and logout flows.
- The frontend returns users to login after a later authenticated request hits `401` and explains that the session expired.
- Backend and frontend auth tests cover the new behavior and pass.

## Open Notes

- No additional API endpoint is required for this story.
- No manual session countdown UI is required for MVP.
- If future stories need richer auth banners or cross-page session notices, build on the same expired-session state instead of introducing parallel handling paths.
