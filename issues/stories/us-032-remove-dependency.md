# US-032 - Remove Dependency

## Metadata
- Area: 8. Dependencies and Blocking
- GitHub labels: `user-story`, `mvp`, `area:dependencies`
- Status: `implemented`
- Suggested wave: `Wave 4`
- Depends on: US-029
- Parallelization note: Implement with the same dependency API and task detail UI as `US-029`.

## User Story
**As an** Admin or Project Manager
**I want** to remove task dependencies
**So that** outdated blockers can be cleared.

### Acceptance Criteria

**Given** I have permission to manage dependencies
**When** I remove a dependency
**Then** the dependency is deleted and blocking state is recalculated.

## Execution Breakdown

### Backend
- [ ] Add dependency delete support to the task-scoped API.
- [ ] Reuse the same permission and visibility rules as dependency creation.

### Frontend
- [ ] Add remove actions next to existing dependency entries for eligible users.
- [ ] Refresh task detail and task list state after removal.

### Tests
- [ ] Add integration coverage for happy-path dependency removal and permission denial.
- [ ] Add frontend coverage for removing a dependency from task detail.

## Definition Of Done
- Dependencies can be removed without stale blocked-state data lingering in the task views.
