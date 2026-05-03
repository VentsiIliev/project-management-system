# US-022 - Delete Task

## Metadata
- Area: `5. Task Management`
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Status: `implemented`
- Suggested wave: `Wave 3`
- Depends on: `US-017`, `US-023`
- Parallelization note: Implement together with `US-023` and `US-061` because task deletion, subtask hierarchy, and hidden deleted-task reads share the same model, API, selector, and workspace UI surface.

## User Story
**As an** Admin or Project Manager  
**I want** to delete tasks  
**So that** obsolete work is hidden from normal workflows.

## Acceptance Criteria

**Given** I have permission to delete tasks  
**When** I delete a task without subtasks  
**Then** the system soft-deletes the task.

**Given** the task has subtasks  
**When** I delete it without cascade confirmation  
**Then** the system rejects the request.

**Given** the task has subtasks and I confirm cascade deletion  
**When** I delete the parent task  
**Then** the system soft-deletes the parent task and its subtasks.

**Given** I am a Team Member  
**When** I attempt to delete a task  
**Then** the system denies permission.

## Execution Slice

### Backend
- [ ] Add task soft-delete service behavior for root tasks and subtasks.
- [ ] Reject parent-task delete requests without `confirm_cascade_subtasks` when active subtasks exist.
- [ ] Cascade soft-delete to active subtasks when confirmation is present.
- [ ] Deny delete for Team Members while keeping `404` for invisible tasks.
- [ ] Return structured delete errors for permission denial and missing cascade confirmation.

### Frontend
- [ ] Add task delete action to the workspace detail panel for Admins and Project Managers only.
- [ ] Show subtask-aware confirmation UI before cascading parent-task deletion.
- [ ] Remove deleted tasks from the visible project task list and clear the selected task when it disappears.
- [ ] Surface structured delete errors without leaving stale selected-task state behind.

### Tests
- [ ] Cover deleting a task without subtasks.
- [ ] Cover rejecting parent delete without cascade confirmation.
- [ ] Cover cascading parent delete with confirmation.
- [ ] Cover Team Member denial.
- [ ] Cover the workspace removing deleted tasks from normal visible state.
