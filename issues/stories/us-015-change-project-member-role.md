# US-015 - Change Project Member Role

## Metadata

- Area: 4. Project Memberships and Roles
- GitHub labels: `user-story`, `mvp`, `area:memberships`
- Suggested status: `Owner Review`
- Suggested wave: `Wave 2`
- Depends on: `US-014`
- Reviewable slice: grouped with `US-016` because both extend the same membership contract and members panel

## User Story

**As an** Admin or Project Manager  
**I want** to change a member's project role  
**So that** responsibilities can be updated.

## Acceptance Criteria

**Given** I have permission to manage members  
**When** I update a member role  
**Then** the new role applies to project permissions.

## Delivery Notes

- Use the spec contract:
  - `PATCH /api/projects/{project_id}/members/{user_id}`
- Accept the same role values already used by `US-014`:
  - `PROJECT_MANAGER`
  - `TEAM_MEMBER`
- If the currently signed-in user downgrades their own membership from `PROJECT_MANAGER` to `TEAM_MEMBER`, the workspace must immediately lose member-management controls after the update succeeds.

## Tasks

### Backend

- [x] Add the membership role-update endpoint.
- [x] Allow only Admins and active `PROJECT_MANAGER` memberships to change member roles.
- [x] Reject invalid roles.
- [x] Return not found when the target active membership does not exist.

### Frontend

- [x] Extend the members panel with inline role editing.
- [x] Refresh or update capability state when the current user changes their own role.
- [x] Show structured validation and permission errors for role updates.

### Tests

- [x] Backend integration coverage for admin update, project-manager update, team-member denial, and missing-membership handling.
- [x] Frontend flow coverage for successful role change and self-downgrade capability loss.

## Definition Of Done

- Active project-member roles can be updated through the spec endpoint.
- The new role changes backend permission behavior immediately.
- The members panel exposes a visible role-editing flow for authorized users.

## Out Of Scope

- Removing members
- Removed-member task labeling
- Activity-log emission for membership changes
