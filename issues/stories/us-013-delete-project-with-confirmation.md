# US-013 - Delete Project With Confirmation

## Metadata

- Area: 3. Projects
- GitHub labels: `user-story`, `mvp`, `area:projects`
- Suggested status: `Owner Review`
- Suggested wave: `Wave 2`
- Depends on: `US-009`, `US-011`
- Reviewable slice: backend project delete contract, frontend confirmation flow, and project visibility regression coverage

## User Story

**As an** Admin or Project Manager  
**I want** to delete a project only after confirmation  
**So that** accidental project deletion is prevented.

## Acceptance Criteria

**Given** I have permission to delete a project  
**When** I submit `DELETE /api/projects/{project_id}` without `confirm_project_delete = true`  
**Then** the system rejects the request with a structured validation error.

**Given** I confirm project deletion  
**When** I delete a project  
**Then** the system soft-deletes the project and its project memberships.

**Given** a project is soft-deleted  
**When** normal users browse project lists or project detail routes  
**Then** the deleted project is hidden from normal project APIs and the frontend workspace.

**Given** a project is deleted  
**When** later task, subtask, and activity-log modules are implemented  
**Then** they must follow the global project-deletion rule from the spec and preserve historical activity instead of hard deleting it.

## Delivery Notes

- Use the API confirmation flag already defined in `docs/planning/project_spec_v4-1.md`:
  - `confirm_project_delete: true`
- Frontend confirmation for this slice is a required checkbox with the exact label:
  - `I understand this will soft-delete this project and its memberships.`
- Permission for delete matches the current edit permission boundary:
  - Admins
  - active `PROJECT_MANAGER` memberships on the target project
- This slice does not invent task, subtask, or activity-log deletion code because those modules are not implemented yet in the current branch stack.

## Tasks

### Backend

- [x] Add `DELETE /api/projects/{project_id}`.
- [x] Require `confirm_project_delete = true`.
- [x] Soft-delete the project and all active memberships in one transaction.
- [x] Return not found for already deleted or inaccessible projects.
- [x] Return permission denied for visible but non-deletable members.

### Frontend

- [x] Add a destructive delete panel on project detail routes.
- [x] Require the confirmation checkbox before submit.
- [x] Submit the delete request and navigate back to the project workspace root on success.
- [x] Remove the deleted project from cached list/detail state.
- [x] Show structured backend validation or permission errors.

### Tests

- [x] Backend integration coverage for confirmation required, admin delete, project-manager delete, member denial, and hidden deleted projects.
- [x] Frontend flow coverage for checkbox-required submit, successful delete navigation, and deleted project disappearance from the workspace.

## Definition Of Done

- `DELETE /api/projects/{project_id}` exists and follows the confirmation contract.
- Deleted projects no longer appear in normal list/detail reads.
- Deleted project memberships are soft-deleted with the project.
- The frontend exposes a visible delete flow from the project workspace.
- Backend and frontend tests cover the acceptance criteria for this slice.

## Out Of Scope

- Cascading task or subtask deletion behavior
- Activity-log write or admin/debug activity-log views
- Membership management CRUD beyond project-delete cascade
