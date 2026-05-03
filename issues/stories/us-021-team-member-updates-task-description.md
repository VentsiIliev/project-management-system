# US-021 - Team Member Updates Task Description

## Metadata

- Area: 5. Task Management
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-019`, `US-020`, `US-014`
- Parallelization note: Keep inside the same task patch slice as `US-020`; this is a field-level permission rule on the same endpoint.

## User Story

**As a** Team Member  
**I want** to update task descriptions  
**So that** I can add execution details.

## Acceptance Criteria

**Given** I am a Team Member on the project  
**When** I update only the task description with the current version  
**Then** the system saves the change.

**Given** I am a Team Member  
**When** I attempt to update planning fields  
**Then** the system denies permission.

## Current Slice Notes

- This is not a separate API. It is the role-restricted branch of `PATCH /api/tasks/{task_id}`.
- The frontend should expose a description-only edit state for Team Members instead of pretending the task is fully read-only.

## Execution Breakdown

### Backend Permission Rule

- [ ] Allow active Team Members to patch `description` only.
- [ ] Reject Team Member attempts to change title, priority, dates, assignee, collaborators, or other planning fields.
- [ ] Keep optimistic-lock checks for Team Member description edits the same as manager edits.

### Frontend Behavior

- [ ] Show a description edit affordance for Team Members.
- [ ] Keep planning controls hidden or disabled for Team Members.
- [ ] Surface permission-denied responses clearly if the API is called directly with forbidden fields.

### Tests

- [ ] Add backend integration coverage for Team Member description-only success.
- [ ] Add backend integration coverage for Team Member planning-field rejection.
- [ ] Add frontend coverage for Team Member description editing and missing planning controls.

## Definition Of Done

- Team Members can update only task descriptions.
- Team Members cannot update planning fields through normal UI or direct API calls.
- The same patch endpoint cleanly supports both manager and Team Member update paths.
