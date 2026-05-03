# US-065 - No Public Registration

## Metadata

- Area: 21. MVP Boundary Stories
- GitHub labels: `user-story`, `mvp`, `area:mvp-boundary`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 1`
- Depends on: `US-001`
- Parallelization note: This is a small boundary-enforcement slice on top of the auth shell.

## User Story

**As a** system owner  
**I want** user creation limited to Admins  
**So that** the internal app remains controlled.

## Acceptance Criteria

**Given** an unauthenticated person visits the app  
**When** they look for sign-up  
**Then** no public registration flow is available.

## Execution Breakdown

### Backend Slice

- [x] Keep user creation limited to the existing admin-only `/api/admin/users` contract.
- [x] Add explicit backend coverage proving there is no public `/api/register` endpoint.

### Frontend Slice

- [x] Keep the login page free of sign-up or create-account affordances.
- [x] Route unknown public registration-style paths back into the existing auth flow instead of exposing a registration screen.

### Test Slice

- [x] Add backend coverage proving `/api/register` is unavailable.
- [x] Add frontend coverage proving unauthenticated `/register` attempts land back on the login flow.
- [x] Add frontend coverage proving the login page does not expose sign-up UI text or actions.

## Dependencies And Notes

- This slice should not add a disabled registration form or placeholder sign-up page.
- This slice should not change the admin-only create-user flow from `US-005`.

## Definition Of Done

- No public registration endpoint exists.
- No public registration route or sign-up affordance exists in the frontend.
- Unauthenticated attempts to reach a registration-style route return to the existing login flow.
