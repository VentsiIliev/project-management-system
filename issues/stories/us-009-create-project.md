# US-009 - Create Project

## Metadata

- Area: 3. Projects
- GitHub labels: `user-story`, `mvp`, `area:projects`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 0`
- Depends on: `US-001`
- Parallelization note: This slice can start once auth is in place. It should stay independent of project edit, delete, member-management, and task stories.

## User Story

**As an** Admin or Project Manager  
**I want** to create projects  
**So that** teams can organize work.

## Acceptance Criteria

**Given** I have permission to create projects  
**When** I provide a project name, unique code, and optional dates  
**Then** the system creates the project.

**Given** the end date is earlier than the start date  
**When** I submit the project  
**Then** the system rejects the request.

**Given** I am a Team Member  
**When** I attempt to create a project  
**Then** the system denies permission.

## Execution Breakdown

### Backend Slice

- [x] Add the owning `projects` and `memberships` models needed for project creation:
  - `Project` with `id`, `name`, `code`, `description`, `owner`, `task_counter`, optional dates, timestamps, and `deleted_at`
  - `ProjectMembership` with `project`, `user`, `role`, timestamps, and `deleted_at`
- [x] Add migrations and constraints for unique project `code`, `owner` lookup indexing, and unique active membership pairs.
- [x] Implement `POST /api/projects` in the `projects` module only.
- [x] Validate that `end_date >= start_date` when both are present.
- [x] Reject duplicate project codes with a structured validation error.
- [x] Model create permission as:
  - Admin is always allowed
  - active users with at least one active `PROJECT_MANAGER` membership are allowed
  - Team Members and non-members without that role are denied
- [x] On successful create, persist the authenticated user as `owner` and create an active `PROJECT_MANAGER` membership for that user on the new project.

### Frontend Slice

- [x] Replace the auth-only protected-shell placeholder with a real project workspace entry screen.
- [x] Add a project creation form with fields for `name`, `code`, `description`, `start_date`, and `end_date`.
- [x] Submit to the shared API client and surface success, validation, and permission-denied states.
- [x] Show the created project details in the authenticated shell after a successful create so the UI visibly changes after login.

### Test Slice

- [x] Add backend integration coverage for successful Admin project creation.
- [x] Add backend integration coverage for successful Project Manager project creation using an active membership fixture.
- [x] Add backend integration coverage for invalid date ranges.
- [x] Add backend integration coverage for duplicate code rejection.
- [x] Add backend integration coverage showing Team Members are denied.
- [x] Add frontend integration coverage for successful project creation from the protected shell.
- [x] Add frontend integration coverage for server validation feedback and permission-denied feedback.

## Dependencies And Notes

- This slice intentionally stops at project creation. It does not implement:
  - project list or detail APIs
  - project edit or immutable-code update flows
  - project deletion
  - member management UI or APIs beyond the creator membership written on create
  - task, Kanban, or Gantt flows
- Planning conflict note:
  - the spec says Project Managers can create projects, but the current role model is project-scoped rather than global. The working implementation rule in this slice is “user has at least one active `PROJECT_MANAGER` membership somewhere,” and the backlog review notes should record that ambiguity.

## Definition Of Done

- `POST /api/projects` exists and creates a project with the authenticated user as owner.
- Valid requests create both the project row and a creator `PROJECT_MANAGER` membership row.
- Invalid date ranges return a structured `VALIDATION_ERROR`.
- Duplicate project codes return a structured validation error on `code`.
- Team Members cannot create projects.
- The authenticated frontend shell exposes a working create-project form and shows the created project details on success.
