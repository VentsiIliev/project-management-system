# US-024 - Parent Completion Requires Completed Subtasks

## Metadata
- Area: 6. Subtasks
- GitHub labels: `user-story`, `mvp`, `area:subtasks`
- Status: `implemented`
- Suggested wave: `Wave 3`
- Depends on: US-023, US-026
- Parallelization note: Implement together with `US-025` because both rules share the same status-change transaction and task detail response surface.

## User Story
**As a** user
**I want** parent tasks to require completed subtasks before completion
**So that** parent progress accurately reflects child work.

### Acceptance Criteria

**Given** a parent task has incomplete subtasks
**When** I attempt to move the parent to DONE
**Then** the system rejects the transition with `SUBTASKS_INCOMPLETE`.

**Given** all subtasks are DONE
**When** I move the parent task to DONE
**Then** the system allows the transition if all other rules pass.

## Execution Breakdown

### Backend
- [ ] Enforce the rule inside the existing task status-change transaction.
- [ ] Treat only active subtasks as part of the completion gate.
- [ ] Return a structured `SUBTASKS_INCOMPLETE` error from the existing status endpoint.

### Frontend
- [ ] Surface the structured error in the existing task detail status-action panel.
- [ ] Keep the current transition list UI and avoid adding a second workflow surface.

### Tests
- [ ] Add integration coverage for parent DONE rejection with at least one active non-final subtask.
- [ ] Add integration coverage for successful parent completion when all active subtasks are final.
- [ ] Add frontend coverage for the visible status-change failure state.

## Dependencies And Follow-Up
- Implement with `US-025` in the same slice.
- Do not add activity-log writes here; that follow-up belongs to `US-040` and `US-041`.

## Definition Of Done
- Parent tasks cannot move to `DONE` while any active subtask is non-final.
- The existing status endpoint returns a stable structured error contract.
- The workspace task detail view shows the failure state without a full-page fallback.
