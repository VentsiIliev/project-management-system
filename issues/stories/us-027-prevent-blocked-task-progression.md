# US-027 - Prevent Blocked Task Progression

## Metadata
- Area: 7. Statuses and Workflow
- GitHub labels: `user-story`, `mvp`, `area:workflow`
- Status: `implemented`
- Suggested wave: `Wave 4`
- Depends on: US-026, US-029, US-031
- Parallelization note: Implement with `US-031` because both rules depend on the same computed blocked-state check inside status transitions.

## User Story
**As a** system
**I want** blocked tasks to be prevented from moving forward
**So that** dependency rules are enforced.

### Acceptance Criteria

**Given** a task has at least one incomplete dependency
**When** a user attempts to move the task to IN_PROGRESS or DONE
**Then** the system rejects the transition with `TASK_BLOCKED`.

**Given** a task is already IN_PROGRESS and later becomes blocked
**When** users view the task
**Then** it remains IN_PROGRESS but shows a blocked indicator.

## Execution Breakdown

### Backend
- [ ] Prevent blocked tasks from moving forward to `IN_PROGRESS` or `DONE`.
- [ ] Allow already-in-progress tasks to remain in place while still surfacing blocked read state.
- [ ] Return a stable `TASK_BLOCKED` error from the existing status endpoint.

### Frontend
- [ ] Surface the blocked-transition failure in the task detail status-action panel.

### Tests
- [ ] Add integration coverage for blocked transition rejection.
- [ ] Add frontend coverage for the structured blocked error state.

## Definition Of Done
- Blocked tasks cannot move forward through status transitions.
- Existing in-progress blocked tasks remain readable and visibly blocked.
