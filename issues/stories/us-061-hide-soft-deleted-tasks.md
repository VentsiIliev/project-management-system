# US-061 - Hide Soft-Deleted Tasks

## Metadata
- Area: `19. Soft Deletion and Data Preservation`
- GitHub labels: `user-story`, `mvp`, `area:lifecycle`
- Suggested status: `Ready`
- Suggested wave: `Wave 5`
- Depends on: `US-022`
- Parallelization note: Keep in the same slice as `US-022` because delete behavior is only reviewable if the normal task reads stop returning the deleted rows.

## User Story
**As a** user  
**I want** deleted tasks hidden from normal views  
**So that** active workflows stay clean.

## Acceptance Criteria

**Given** a task is soft-deleted  
**When** Kanban, Gantt, My Tasks, search, filters, or normal APIs are loaded  
**Then** the task is excluded.

## Execution Slice

### Backend
- [ ] Keep normal task selectors and task detail reads scoped to non-deleted tasks.
- [ ] Ensure subtask serialization excludes deleted subtasks from parent detail responses.
- [ ] Lock in the current hidden-from-normal-read rule with integration coverage on list and detail endpoints.

### Frontend
- [ ] Remove soft-deleted tasks from the project task list after successful deletion.
- [ ] Treat a previously selected deleted task as unavailable and clear the workspace selection cleanly.

### Tests
- [ ] Cover deleted tasks disappearing from project task list responses.
- [ ] Cover deleted tasks returning `TASK_NOT_FOUND` from task detail.
- [ ] Cover parent detail excluding deleted subtasks.
