# US-031 - Compute Blocked State

## Metadata
- Area: 8. Dependencies and Blocking
- GitHub labels: `user-story`, `mvp`, `area:dependencies`
- Status: `:owner-review`
- Suggested wave: `Wave 4`
- Depends on: US-029, US-026
- Parallelization note: Implement together with `US-027` on top of the same computed dependency state.

## User Story
**As a** user
**I want** blocked state to be computed automatically
**So that** task status remains accurate.

### Acceptance Criteria

**Given** a task depends on another task that is not final
**When** I view the task
**Then** the task shows as blocked.

**Given** all dependencies are final
**When** I view the task
**Then** the task does not show as blocked.

**Given** a task has no dependencies
**When** I view the task
**Then** the task does not show as blocked.

## Execution Breakdown

### Backend
- [ ] Compute blocked state from active dependency targets with non-final statuses.
- [ ] Keep `BLOCKED` as computed read state only, not a stored workflow status.
- [ ] Populate dependency lists on task list and task detail responses.

### Frontend
- [ ] Render blocked indicators and dependency lists in the current task workspace.

### Tests
- [ ] Add integration coverage for blocked and unblocked read states.
- [ ] Add frontend coverage for blocked indicator rendering.

## Definition Of Done
- `is_blocked` is derived from dependencies instead of stored state.
- Task list and task detail responses expose the same blocked-state behavior.
