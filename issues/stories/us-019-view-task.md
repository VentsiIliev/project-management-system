# US-019 - View Task

## Metadata

- Area: 5. Task Management
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-017`, `US-028`, `US-053`
- Parallelization note: Implement together with `US-020`, `US-021`, `US-026`, `US-070`, and `US-071` as one task-detail and task-update foundation slice.

## User Story

**As a** project member  
**I want** to view task details  
**So that** I can understand the work.

## Acceptance Criteria

**Given** I have access to the task's project  
**When** I open the task  
**Then** I can see title, description, status, priority, assignee, collaborators, dates, dependencies, subtasks, blocked state, overdue state, and version.

**Given** I do not have access to the task's project  
**When** I attempt to open the task  
**Then** the system denies access.

## Current Slice Notes

- This slice is the first single-task read and edit foundation after task creation.
- Dependencies and subtasks are not implemented yet, so task detail should return stable empty collections and a computed `is_blocked = false` placeholder until `US-023`, `US-029`, `US-030`, `US-031`, and `US-032` land.
- Workflow metadata reads already exist from `US-028` and `US-053`; reuse them for status and priority rendering instead of hard-coding frontend values.

## Execution Breakdown

### Backend Read Contract

- [ ] Add `GET /api/tasks/{task_id}` for any visible task.
- [ ] Return the task detail contract with:
  - task identity and project id
  - title and description
  - structured status and priority objects
  - primary assignee and collaborators
  - dates
  - `is_blocked`
  - `is_overdue`
  - `version`
  - `subtasks`
  - `dependencies`
- [ ] Use backend visibility rules so non-members and removed members receive `404`.

### Frontend Read Contract

- [ ] Add task selection in the project workspace.
- [ ] Load task detail separately from the project task list.
- [ ] Show loading, empty, not-found, and generic error states inside the task detail area.
- [ ] Render overdue and inactive metadata clearly without inventing new frontend-only workflow meaning.

### Tests

- [ ] Add backend integration coverage for visible-task read and hidden-task read.
- [ ] Add frontend tests for selecting a task and rendering the detail state.

## Definition Of Done

- Task detail can be fetched for any visible task.
- Inaccessible task ids do not leak project visibility.
- The task detail response already contains stable placeholders for future subtask and dependency features.
- The project workspace can open and render a single task detail view.
