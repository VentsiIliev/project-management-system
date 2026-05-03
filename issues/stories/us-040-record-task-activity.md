# US-040 - Record Task Activity

## Metadata
- Area: 11. Activity Logs
- GitHub labels: `user-story`, `mvp`, `area:activity`
- Status: `:owner-review`
- Suggested wave: `Wave 4`
- Depends on: US-017
- Parallelization note: Implement together with `US-041`, `US-042`, and `US-062` because they share one activity-log write model and read contract.

## User Story
**As a** user
**I want** task history to be recorded
**So that** important changes are auditable.

### Acceptance Criteria

**Given** a tracked task event occurs
**When** the action completes
**Then** the system creates an activity log entry.

**Given** a task is soft-deleted
**When** its history is inspected
**Then** related activity logs remain preserved.

## Execution Breakdown

### Backend
- [ ] Add the owned activity-log persistence model and serializers.
- [ ] Emit task-scoped activity entries from task create, update, status change, delete, dependency add/remove, and parent auto-reopen flows.
- [ ] Keep activity creation inside the same backend mutation path so successful writes and activity entries stay consistent.

### Tests
- [ ] Add integration coverage showing task mutations create task activity entries.
- [ ] Add coverage for deleted-task history preservation.

## Definition Of Done
- Task mutations create durable activity entries.
- Activity entries remain available after task soft delete.
