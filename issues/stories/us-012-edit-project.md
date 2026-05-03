# US-012 - Edit Project

## Metadata

- Area: 3. Projects
- GitHub labels: `user-story`, `mvp`, `area:projects`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 2`
- Depends on: `US-009`, `US-011`
- Parallelization note: This slice should follow `US-011` because it builds directly on the new project detail route and read contract.

## User Story

**As an** Admin or Project Manager  
**I want** to edit project details  
**So that** project information stays current.

## Acceptance Criteria

**Given** I am an Admin or Project Manager  
**When** I update editable project fields  
**Then** the system saves the changes.

**Given** I am a Team Member  
**When** I attempt to edit project details  
**Then** the system denies permission.

## Execution Breakdown

### Backend Slice

- [x] Implement `PATCH /api/projects/{project_id}` in the owning `projects` module.
- [x] Allow updates only to:
  - `name`
  - `description`
  - `start_date`
  - `end_date`
- [x] Reuse active-project visibility for target lookup.
- [x] Allow edit permission only to:
  - Admin
  - active `PROJECT_MANAGER` members on that project
- [x] Deny Team Members with a structured permission error.
- [x] Reuse project date-range validation on update.
- [x] Return the updated canonical project payload on success.

### Frontend Slice

- [x] Add an edit form inside the project detail workspace.
- [x] Prefill the form from the selected project detail query.
- [x] Submit updates through the shared API client and refresh the detail/list state.
- [x] Surface visible success, validation, and permission-denied states.
- [x] Keep the create flow intact and do not replace the project access workspace.

### Test Slice

- [x] Add backend integration coverage for successful edit by Admin.
- [x] Add backend integration coverage for successful edit by project `PROJECT_MANAGER`.
- [x] Add backend integration coverage showing Team Members receive a permission error.
- [x] Add backend integration coverage for invalid date-range updates.
- [x] Add frontend integration coverage for editing a project from the detail route.
- [x] Add frontend integration coverage for permission-denied edit attempts.

## Dependencies And Notes

- This slice intentionally stops at project update only. It does not implement:
  - project deletion
  - member management changes
  - task flows
  - activity-log display
- The immutable-code invariant from `US-010` should be delivered on the same PATCH route rather than as a separate standalone branch.

## Definition Of Done

- `PATCH /api/projects/{project_id}` exists and updates editable project fields.
- Admins and active project managers can edit projects.
- Team Members cannot edit project details.
- Invalid date ranges return a structured validation error.
- The project detail workspace includes a working edit form with visible success and failure states.
