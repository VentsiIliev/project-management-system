# US-023 - Create Subtask

## Metadata
- Area: `6. Subtasks`
- GitHub labels: `user-story`, `mvp`, `area:subtasks`
- Status: `implemented`
- Suggested wave: `Wave 3`
- Depends on: `US-017`, `US-018`, `US-069`
- Parallelization note: Implement together with `US-022` and `US-061` because the subtask hierarchy changes the task model, task create contract, task detail response, and delete semantics in the same code path.

## User Story
**As an** Admin or Project Manager  
**I want** to create subtasks  
**So that** large tasks can be broken into smaller pieces.

## Acceptance Criteria

**Given** I have permission to create subtasks  
**When** I create a task with a valid parent task in the same project  
**Then** the system creates a one-level subtask.

**Given** the parent task belongs to another project  
**When** I create the subtask  
**Then** the system rejects the request.

**Given** the parent task is already a subtask  
**When** I attempt to create another child under it  
**Then** the system rejects the request with `INVALID_HIERARCHY`.

## Execution Slice

### Backend
- [ ] Add parent-task linkage on `Task` with one-level hierarchy enforcement.
- [ ] Extend task creation to accept optional `parent_task_id`.
- [ ] Validate that the parent task is visible, active, and in the same project.
- [ ] Reject attempts to create children under an existing subtask.
- [ ] Extend task detail serialization to include active subtasks so the workspace can inspect hierarchy.

### Frontend
- [ ] Extend the task creation form with optional parent-task selection from the current project.
- [ ] Render visible subtasks inside the task detail panel.
- [ ] Allow opening a subtask from the parent task detail view without leaving the project workspace.

### Tests
- [ ] Cover creating a valid one-level subtask.
- [ ] Cover rejecting a parent task from another project or invisible project.
- [ ] Cover rejecting children under an existing subtask with `INVALID_HIERARCHY`.
- [ ] Cover task detail returning active subtasks only.
