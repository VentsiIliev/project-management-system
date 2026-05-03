# US-062 - Preserve Historical References

## Metadata
- Area: 19. Soft Deletion and Data Preservation
- GitHub labels: `user-story`, `mvp`, `area:lifecycle`
- Status: `:owner-review`
- Suggested wave: `Wave 5`
- Depends on: US-061, US-040
- Parallelization note: Implement inside the activity-log batch so the write model stores historical snapshots from the start.

## User Story
**As a** system
**I want** historical references to remain available
**So that** audit history remains understandable.

### Acceptance Criteria

**Given** a user, task, or project is soft-deleted
**When** activity logs reference that entity
**Then** the logs remain available and retain historical context.

## Execution Breakdown

### Backend
- [ ] Store snapshot fields needed to render project, task, and actor labels even after soft deletion.
- [ ] Keep log queries independent from normal active-only task detail/query managers where historical access is required.

### Frontend
- [ ] Render historical references from the activity payload without assuming the live entity is still visible.

### Tests
- [ ] Add integration coverage showing logs keep human-readable context after soft delete.

## Definition Of Done
- Activity entries remain readable after referenced users, tasks, or projects are soft-deleted.
- The UI does not break when a referenced entity is no longer part of normal active reads.
