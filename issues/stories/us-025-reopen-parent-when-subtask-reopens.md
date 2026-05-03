# US-025 - Reopen Parent When Subtask Reopens

## Metadata
- Area: 6. Subtasks
- GitHub labels: `user-story`, `mvp`, `area:subtasks`
- Status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: US-023, US-026
- Parallelization note: Implement together with `US-024` because both rules belong to the same status transition path.

## User Story
**As a** system
**I want** to reopen a completed parent task when a subtask is reopened
**So that** task status remains consistent.

### Acceptance Criteria

**Given** a parent task is DONE
**And** one of its subtasks is DONE
**When** the subtask is changed to a non-final status
**Then** the system automatically reopens the parent task.

**Given** the parent is reopened automatically
**When** the action is completed
**Then** the system records a `PARENT_REOPENED` activity log entry.

## Execution Breakdown

### Backend
- [ ] Reopen a DONE parent inside the same status-change transaction when a child moves from final to non-final.
- [ ] Keep the returned task detail payload consistent for both the changed subtask and the reopened parent task list read model.

### Frontend
- [ ] Refresh the task detail and project task list cache so the reopened parent state is visible immediately.

### Tests
- [ ] Add integration coverage for automatic parent reopen after a subtask leaves a final state.
- [ ] Add regression coverage showing no reopen happens when the parent is already non-final.

## Dependencies And Follow-Up
- The `PARENT_REOPENED` activity-log requirement is deferred to `US-040` and `US-041`.
- Record that backlog drift in `issues/review-findings.md` instead of inventing partial audit behavior here.

## Definition Of Done
- A subtask moving from final to non-final reopens a DONE parent automatically.
- The task status endpoint and workspace queries reflect the reopened parent without manual refresh sequencing bugs.
