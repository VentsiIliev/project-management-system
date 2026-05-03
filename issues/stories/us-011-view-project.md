# US-011 - View Project

## Metadata

- Area: 3. Projects
- GitHub labels: `user-story`, `mvp`, `area:projects`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 2`
- Depends on: `US-009`
- Parallelization note: This slice can start once `US-009` is in place. It should land before project edit and delete because those stories need a real read surface.

## User Story

**As a** project member  
**I want** to view projects I belong to  
**So that** I can access project work.

## Acceptance Criteria

**Given** I am a project member  
**When** I open the project  
**Then** I can view project details.

**Given** I am not a project member and not an Admin  
**When** I attempt to view the project  
**Then** the system denies access or hides the project.

## Execution Breakdown

### Backend Slice

- [x] Add project read queries under the owning `projects` module for:
  - active projects visible to the authenticated user
  - a single active project by id when the authenticated user has access
- [x] Implement `GET /api/projects` to return the current user's visible projects.
- [x] Implement `GET /api/projects/{project_id}` to return project details for an accessible active project.
- [x] Treat access as:
  - Admin can view any active project
  - active project members can view that project
  - non-members and removed members cannot view the project
- [x] Hide inaccessible or soft-deleted projects from normal reads.

### Frontend Slice

- [x] Replace the create-only shell workspace with a project-access workspace.
- [x] Show a visible list of accessible projects after login.
- [x] Allow opening a project from the list into a dedicated project detail route.
- [x] Keep the create-project form in the workspace so `US-009` stays usable.
- [x] Surface empty, loading, and unavailable states for the new read flow.

### Test Slice

- [x] Add backend integration coverage for listing only accessible projects for a normal member.
- [x] Add backend integration coverage for Admin visibility across projects.
- [x] Add backend integration coverage for successful project detail reads by an active member.
- [x] Add backend integration coverage showing non-members and removed members cannot read a project.
- [x] Add frontend integration coverage for loading the accessible project list after login.
- [x] Add frontend integration coverage for opening a project detail route from the list.
- [x] Add frontend integration coverage for an unavailable project detail route.

## Dependencies And Notes

- This slice intentionally stops at project read access. It does not implement:
  - project edit mutations
  - project code immutability enforcement on update
  - project deletion
  - project member management beyond honoring the existing membership rows
- `US-010` should build on the update path introduced by `US-012`. Until a project update endpoint exists, immutability remains a project rule in the spec and model contract, but there is no meaningful PATCH surface to reject yet.
- The frontend outcome for this story must be visible after login. A backend-only read endpoint is not sufficient for this slice.

## Definition Of Done

- Authenticated users can load a list of projects they are allowed to access.
- Admins can see active projects even when they are not members.
- Active project members can open a project detail route and view project details.
- Non-members and removed members cannot access project details through normal reads.
- The authenticated shell visibly changes from create-only to project-access navigation with working loading, empty, and unavailable states.
