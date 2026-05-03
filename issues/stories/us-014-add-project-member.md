# US-014 - Add Project Member

## Metadata

- Area: 4. Project Memberships and Roles
- GitHub labels: `user-story`, `mvp`, `area:memberships`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 2`
- Depends on: `US-009`, `US-005`
- Reviewable slice: membership list/read surface plus add-member contract and UI

## User Story

**As an** Admin or Project Manager  
**I want** to add users to projects  
**So that** they can collaborate on project work.

## Acceptance Criteria

**Given** I have permission to manage members  
**When** I add an active user with a valid project role  
**Then** the user becomes a project member.

**Given** the role is not `PROJECT_MANAGER` or `TEAM_MEMBER`  
**When** I submit the request  
**Then** the system rejects the request.

## Delivery Notes

- Use the spec membership contract:
  - `GET /api/projects/{project_id}/members`
  - `POST /api/projects/{project_id}/members`
- Add-member request shape:
  - `user_id`
  - `role`
- The current slice includes a visible members panel on project detail routes because the story is frontend-visible.
- `US-015` role change and `US-016` removal stay out of this slice even though the data model overlaps.
- Because memberships have a unique `(project, user)` constraint, re-adding a previously removed member reactivates the soft-deleted membership with the requested role.

## Tasks

### Backend

- [x] Add project-member list and create endpoints under the membership contract.
- [x] Allow all visible project users to read members.
- [x] Allow only Admins and active `PROJECT_MANAGER` memberships to add members.
- [x] Reject invalid roles.
- [x] Reject nonexistent, soft-deleted, or inactive target users.
- [x] Reactivate a previously soft-deleted membership instead of creating a duplicate row.

### Frontend

- [x] Add a members panel to the project workspace.
- [x] Show the current active member list for visible projects.
- [x] Add a member form with `user_id` and role selection.
- [x] Hide the add-member form for users without manage-member permission.
- [x] Show structured validation and permission errors.

### Tests

- [x] Backend integration coverage for member list visibility, admin add, project-manager add, invalid role rejection, target-user rejection, and soft-deleted membership reactivation.
- [x] Frontend flow coverage for visible member list, add-member success, and manage-member form hiding for read-only users.

## Definition Of Done

- Project members can be listed through the spec endpoint.
- Active users can be added with valid project roles by authorized actors.
- Invalid roles and invalid target users are rejected with structured errors.
- The project workspace exposes a visible members panel and add-member flow.
- Backend and frontend tests cover the acceptance criteria for this slice.

## Out Of Scope

- Changing an existing active member role
- Removing a member
- Removed-member task labeling
- Activity-log emission for membership changes
