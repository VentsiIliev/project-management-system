# US-070 - Enforce Active Project Members for Assignments

## Metadata

- Area: 22. Key Invariant Coverage
- GitHub labels: `user-story`, `mvp`, `area:invariants`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-014`, `US-017`, `US-020`
- Parallelization note: Implement together with the first task patch contract. Assignment and collaborator validation belong to the same backend validator path.

## User Story

**As a** system  
**I want** assignees and collaborators to be active project members  
**So that** tasks are assigned only to valid participants.

## Acceptance Criteria

**Given** a manager assigns a user to a task  
**When** the user is not an active project member  
**Then** the system rejects the assignment.

**Given** a collaborator is added  
**When** the user is not an active project member  
**Then** the system rejects the collaborator update.

## Current Slice Notes

- Primary-assignee validation already exists on task create. Expand and reuse it for task patch and collaborator persistence.
- This story should not wait for a dedicated collaborator epic because the accepted update contract already needs collaborator validation.

## Execution Breakdown

### Backend Invariant

- [ ] Reuse one active-project-member validation path for primary assignee and collaborators.
- [ ] Reject inactive users, removed members, non-members, and soft-deleted memberships.
- [ ] Keep primary assignee out of the collaborator list.

### Frontend Behavior

- [ ] Drive assignee and collaborator choices from the active member list in the project workspace.
- [ ] Show backend validation errors clearly for invalid assignee or collaborator updates.

### Tests

- [ ] Add backend integration coverage for invalid assignee updates.
- [ ] Add backend integration coverage for invalid collaborator updates.
- [ ] Add frontend coverage for collaborator validation feedback.

## Definition Of Done

- Assignees and collaborators must be active project members on task update.
- Validation behavior is consistent between task create and task patch.
- The frontend uses the project member dataset as the source for assignment choices.
