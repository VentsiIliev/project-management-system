# US-026 - Change Task Status

## Metadata

- Area: 7. Statuses and Workflow
- GitHub labels: `user-story`, `mvp`, `area:workflow`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-019`, `US-028`
- Parallelization note: Implement inside the same task-detail foundation slice. It reuses the same task read model, permission checks, version handling, and workspace UI.

## User Story

**As a** project member  
**I want** to change task status  
**So that** task progress is visible.

## Acceptance Criteria

**Given** I have permission to change status  
**When** I submit a valid status transition with the current version  
**Then** the system updates the status and increments the version.

**Given** the transition is not allowed  
**When** I submit the status change  
**Then** the system rejects the request with `INVALID_STATUS_TRANSITION`.

## Current Slice Notes

- This slice only owns database-driven transition validation plus optimistic locking.
- Blocked-task progression and parent/subtask completion rules belong to later stories and should not be invented here.

## Execution Breakdown

### Backend Status Contract

- [ ] Add `POST /api/tasks/{task_id}/status`.
- [ ] Require `to_status_id` and `version`.
- [ ] Allow Admins, Project Managers, and Team Members to change status for visible tasks.
- [ ] Validate the transition against active database-driven status transitions.
- [ ] Increment task version on success.
- [ ] Return `INVALID_STATUS_TRANSITION` for invalid or inactive transitions.

### Frontend Status Contract

- [ ] Show available status-change actions from workflow metadata and the current task status.
- [ ] Let Team Members change status even when they cannot edit planning fields.
- [ ] Reuse the same optimistic-lock handling pattern as task planning edits.

### Tests

- [ ] Add backend integration coverage for valid status changes, invalid transitions, and stale-version conflicts.
- [ ] Add frontend tests for status changes and invalid/conflict error states.

## Definition Of Done

- Status changes use database-driven transitions.
- Status mutations require the current version and increment it on success.
- Team Members can change task status without gaining planning-field permissions.
