# US-041 - View Task Activity

## Metadata
- Area: 11. Activity Logs
- GitHub labels: `user-story`, `mvp`, `area:activity`
- Status: `implemented`
- Suggested wave: `Wave 4`
- Depends on: US-040, US-019
- Parallelization note: Implement with `US-040` on the same task detail surface.

## User Story
**As a** project member
**I want** to view task activity
**So that** I can understand what changed over time.

### Acceptance Criteria

**Given** I have access to the task
**When** I open task activity
**Then** I can view activity log entries for that task.

**Given** I do not have task access
**When** I attempt to view task activity
**Then** the system denies access.

## Execution Breakdown

### Backend
- [ ] Add `GET /tasks/{task_id}/activity`.
- [ ] Reuse task visibility rules, while still allowing activity reads for soft-deleted tasks inside visible projects.

### Frontend
- [ ] Extend the existing task detail panel with a task-activity section.
- [ ] Show loading, empty, and unavailable states.

### Tests
- [ ] Add integration coverage for visible and denied task activity reads.
- [ ] Add frontend coverage for rendering task activity in task detail.

## Definition Of Done
- Task activity is visible in the existing workspace for accessible tasks.
- Soft-deleted task activity remains readable for users who still have project visibility.
