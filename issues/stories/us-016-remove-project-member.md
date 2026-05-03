# US-016 - Remove Project Member

## Metadata

- Area: 4. Project Memberships and Roles
- GitHub labels: `user-story`, `mvp`, `area:memberships`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 2`
- Depends on: `US-014`
- Reviewable slice: grouped with `US-015` because both extend the same membership contract and members panel

## User Story

**As an** Admin or Project Manager  
**I want** to remove members from projects  
**So that** access can be revoked.

## Acceptance Criteria

**Given** I remove a project member  
**When** the removal succeeds  
**Then** the membership is soft-deleted.

**Given** a removed member attempts to access the project  
**When** they open project pages or APIs  
**Then** the system denies access.

**Given** the removed user was assigned to tasks  
**When** those tasks are viewed in a future task slice  
**Then** the assignment must remain visible and be labeled as removed from project.

## Delivery Notes

- Use the spec contract:
  - `DELETE /api/projects/{project_id}/members/{user_id}`
- The current grouped slice owns:
  - membership soft-delete
  - immediate project access loss
  - frontend removal action in the members panel
- Task-assignment labeling remains deferred because task reads are not implemented in the current branch stack.
- If the currently signed-in user removes their own membership, the workspace should navigate away from the project route after success because the project is no longer visible.

## Tasks

### Backend

- [x] Add the membership remove endpoint.
- [x] Allow only Admins and active `PROJECT_MANAGER` memberships to remove members.
- [x] Soft-delete the target active membership.
- [x] Return not found when the target active membership does not exist.

### Frontend

- [x] Extend the members panel with a remove-member action.
- [x] Remove the deleted member from cached member state.
- [x] Navigate away when the current user removes their own membership.
- [x] Show structured permission and missing-member errors.

### Tests

- [x] Backend integration coverage for admin removal, project-manager removal, team-member denial, missing-membership handling, and removed-member access loss.
- [x] Frontend flow coverage for successful removal and self-removal redirect.

## Definition Of Done

- Active memberships can be soft-deleted through the spec endpoint.
- Removed members lose project access immediately.
- The members panel exposes a visible remove action for authorized users.

## Out Of Scope

- Task assignment labels for removed members
- Activity-log emission for membership changes
