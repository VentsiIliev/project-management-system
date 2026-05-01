# US-005 - Create User

## Metadata

- Area: 2. Admin User Management
- GitHub labels: `user-story`, `mvp`, `area:admin`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 0`
- Depends on: `US-001`
- Builds on auth stack through: `US-004`

## User Story

**As an** Admin  
**I want** to create user accounts  
**So that** employees can access the system.

## Acceptance Criteria

**Given** I am an Admin  
**When** I create a user with name, unique email, and valid temporary password  
**Then** the system creates an active user with `must_reset_password = true`.

**Given** the email is already used  
**When** I attempt to create the user  
**Then** the system rejects the request with a validation error.

**Given** I am not an Admin  
**When** I attempt to create a user  
**Then** the system denies permission.

## Execution Breakdown

### Backend slice

- [x] Add an admin-only create-user API endpoint in the `users` module.
- [x] Keep request validation transport-level and user-creation rules in a domain service.
- [x] Create the user with:
  - normalized unique email
  - active account by default
  - `must_reset_password = true`
  - password hashed through Django user APIs
- [x] Reuse the existing password validation path so admin-set temporary passwords follow the same policy.
- [x] Return a stable response payload with the created user's public fields needed for future admin UI work.
- [x] Deny access for non-admin authenticated users.

### Frontend slice

- [x] No dedicated admin UI in this slice.
- [x] Defer admin screens and routes until there is an owned admin feature surface to attach them to.
- [x] Keep the backend response contract explicit so a later admin UI story can integrate without revisiting create-user rules.

### Test slice

- [x] Add backend integration coverage for successful admin user creation.
- [x] Add backend coverage for duplicate-email validation.
- [x] Add backend coverage for non-admin permission denial.
- [x] Add backend coverage that the stored password is hashed and the created user must reset their password.
- [x] Re-run the focused auth and user-management backend tests.

## Dependency And Sequencing Notes

- This story depends on the existing session-auth stack so admin identity is available server-side.
- It should remain separate from:
  - `US-006` update user
  - `US-007` admin password reset
  - `US-008` deactivate user
  - broader admin list/detail UI work
- The first valid slice is backend-led because the current frontend only exposes auth/system routing, not an admin workspace.

## Definition Of Done

- Admins can create users through the API with name, email, and temporary password.
- New users are active and created with `must_reset_password = true`.
- Duplicate emails return a structured validation error.
- Non-admins cannot create users.
- Backend tests cover the acceptance criteria and pass.

## Open Notes

- Activity logging for `USER_CREATED` is part of the broader observability/audit surface and can follow once that module exists.
- This slice should not invent admin tables, forms, or navigation before the admin feature surface is introduced.
