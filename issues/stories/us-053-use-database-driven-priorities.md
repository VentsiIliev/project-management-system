# US-053 - Use Database-Driven Priorities

## Metadata

- Area: 16. Priorities and Metadata
- GitHub labels: `user-story`, `mvp`, `area:metadata`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 0`
- Depends on: `US-017`
- Parallelization note: Deliver this with `US-028` because both stories change the task metadata contract.

## User Story

**As an** Admin  
**I want** priorities to be database-driven  
**So that** priority options can be configured.

## Acceptance Criteria

**Given** an active priority exists  
**When** a manager creates a task  
**Then** the priority can be assigned.

**Given** a priority is inactive  
**When** a manager creates a new task  
**Then** the inactive priority cannot be assigned.

**Given** an existing task references an inactive priority  
**When** the task is listed or viewed  
**Then** the inactive priority remains visible.

## Current Slice Notes

- The local issue previously treated this as non-MVP, but the spec and user-story source both require database-driven priorities for MVP.
- This slice covers priority catalogs plus task create and task list integration only.
- Task update support for priorities lands later with `US-020`.

## Implementation Breakdown

**Kanban lane:** Backlog -> Ready -> Red -> Green -> Refactor -> Review / QA -> Done  
**Definition of Done:** Priorities are stored in the database, active priorities can be assigned on task create, inactive priorities are rejected for new assignment, and existing tasks can still render inactive priorities.

### Database

- [ ] Add a `TaskPriority` model in the owning `tasks` module.
- [ ] Add a nullable `priority` foreign key to tasks.
- [ ] Seed default priorities for the MVP task create flow.

### Backend/API

- [ ] Accept `priority_id` on project task create.
- [ ] Return structured priority objects from task list and create responses.
- [ ] Create workflow metadata read support for task priorities.
- [ ] Reject inactive priorities on new task creation with a validation error.

### Frontend/UI

- [ ] Add a priority selector to the current project task create form.
- [ ] Load active priorities from the workflow metadata API instead of hard-coding options.
- [ ] Continue showing inactive priorities on existing returned tasks.

### Tests

- [ ] Add backend integration coverage for active and inactive priority assignment.
- [ ] Add backend coverage for workflow priority metadata responses.
- [ ] Add frontend coverage for selecting an active priority and rendering returned priority data.
