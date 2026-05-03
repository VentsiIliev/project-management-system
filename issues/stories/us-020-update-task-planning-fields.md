# US-020 - Update Task Planning Fields

## Metadata

- Area: 5. Task Management
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-017`, `US-019`, `US-028`, `US-053`
- Parallelization note: Implement with `US-019`, `US-021`, `US-026`, `US-070`, and `US-071` because the same backend patch contract and workspace edit UI own all of them.

## User Story

**As an** Admin or Project Manager  
**I want** to update task planning fields  
**So that** project plans stay accurate.

## Acceptance Criteria

**Given** I am an Admin or Project Manager  
**When** I update title, priority, dates, assignee, collaborators, or description with the current version  
**Then** the system saves the update and increments the task version.

**Given** I submit an outdated task version  
**When** I update the task  
**Then** the system rejects the request with `OPTIMISTIC_LOCK_FAILED`.

## Current Slice Notes

- This story owns the first `PATCH /api/tasks/{task_id}` contract.
- Collaborator persistence belongs in this slice because the accepted update contract already includes `collaborator_ids`; do not defer it to an imaginary later story.
- Frontend optimistic-lock handling from `US-059` should be absorbed here instead of waiting for a separate task-only conflict slice.

## Execution Breakdown

### Backend Update Contract

- [ ] Add `PATCH /api/tasks/{task_id}`.
- [ ] Require `version` for every task mutation.
- [ ] Allow Admins and Project Managers to update:
  - title
  - description
  - priority
  - start date
  - deadline
  - primary assignee
  - collaborators
- [ ] Increment task `version` on success.
- [ ] Return `OPTIMISTIC_LOCK_FAILED` with `current_version` when the submitted version is stale.

### Validation

- [ ] Reuse active project-member validation for assignee and collaborators.
- [ ] Reject inactive priorities on update.
- [ ] Reject invalid date ranges.
- [ ] Reject collaborator lists that duplicate the primary assignee.

### Frontend Update Contract

- [ ] Add a task edit form in the project workspace for manager-capable users.
- [ ] Use workflow metadata and member data to drive status, priority, assignee, and collaborator controls.
- [ ] On optimistic-lock failure, show: `This task was changed by someone else. Please refresh and try again.`
- [ ] Refresh task detail after the conflict response and allow manual retry.

### Tests

- [ ] Add backend integration coverage for successful task updates, stale-version conflicts, and validation failures.
- [ ] Add frontend tests for successful edit and optimistic-lock conflict handling.

## Definition Of Done

- Task planning fields can be updated through a versioned patch endpoint.
- Successful updates increment task version.
- Stale updates return the expected optimistic-lock contract.
- The workspace edit form reflects backend validation and conflict responses clearly.
