# US-028 - Database-Driven Statuses

## Metadata

- Area: 7. Statuses and Workflow
- GitHub labels: `user-story`, `mvp`, `area:workflow`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 0`
- Depends on: `US-017`
- Parallelization note: Keep this grouped with `US-053` because both stories reshape the task metadata contract used by task create, task list, and later task update and Kanban work.

## User Story

**As an** Admin  
**I want** task statuses to be database-driven  
**So that** workflow metadata can evolve over time.

## Acceptance Criteria

**Given** MVP statuses exist in the database  
**When** a task is created  
**Then** the task is assigned the database-backed `TODO` status by default.

**Given** the frontend requests workflow metadata  
**When** statuses are returned  
**Then** active and inactive statuses are included in `sort_order` order with enough metadata for future Kanban rendering.

**Given** an inactive status exists  
**When** workflow metadata is requested  
**Then** the inactive status still appears and is marked inactive instead of being dropped from the response.

## Current Slice Notes

- This slice establishes the database-backed status catalog and read contract only.
- Kanban rendering belongs to `US-046`.
- Dragging a task into a new status belongs to `US-047` and `US-026`.

## Implementation Breakdown

**Kanban lane:** Backlog -> Ready -> Red -> Green -> Refactor -> Review / QA -> Done  
**Definition of Done:** The status catalog exists in the database, task create and list no longer depend on a hard-coded app enum, and the workflow metadata contract is stable enough for the later task-detail, task-update, and Kanban slices.

### Database

- [ ] Add a `TaskWorkflowStatus` model in the owning `tasks` module.
- [ ] Replace the current task status text field with a foreign key to the status catalog.
- [ ] Add the status indexes required by the spec.
- [ ] Seed MVP statuses `TODO`, `IN_PROGRESS`, and `DONE`.
- [ ] Seed default transitions needed by later workflow stories without implementing status-change behavior yet.

### Backend/API

- [ ] Return structured status objects from project task list and create responses.
- [ ] Create workflow metadata read endpoints for statuses and status transitions.
- [ ] Keep status-write behavior deferred to `US-026`.

### Frontend/UI

- [ ] Stop assuming task status is only a hard-coded string name.
- [ ] Keep the current project task panel aligned with the new task response shape.
- [ ] Do not add Kanban UI in this slice.

### Tests

- [ ] Add integration coverage for seeded statuses and metadata endpoints.
- [ ] Add regression coverage showing newly created tasks default to the seeded `TODO` status.
- [ ] Add frontend coverage for rendering status metadata returned by the API contract.
