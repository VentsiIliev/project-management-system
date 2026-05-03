# US-069 - Enforce Task-Project Ownership

## Metadata

- Area: 22. Key Invariant Coverage
- GitHub labels: `user-story`, `mvp`, `area:invariants`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-017`
- Parallelization note: Implement with `US-018`. Both stories validate the same task persistence boundary and should stay in one review slice.

## User Story

**As a** system  
**I want** every task to belong to exactly one project  
**So that** authorization, search, and task numbering remain consistent.

## Acceptance Criteria

**Given** a task is created  
**When** it is persisted  
**Then** it must have exactly one project.

## Current Slice Notes

- The data model already enforced the core ownership rule with a required `Task.project` foreign key.
- The slice for this story is to prove that invariant explicitly and keep the test aligned with the current database-backed status model.
- Do not pull dependency-graph or blocked-state behavior into this story; those belong to later task-dependency stories.

## Execution Breakdown

### Persistence Invariant

- [x] Keep `Task.project` as a required foreign key with no nullable ownership path.
- [x] Keep project-scoped task numbering tied to that required ownership relation.
- [x] Reuse the existing task-create path instead of adding a second persistence entry point.

### Test Slice

- [x] Add explicit regression coverage proving a task cannot be persisted without a project.
- [x] Keep the test independent of migration seeding by creating or reusing the required workflow status row inside the test setup.
- [x] Assert API-created tasks also persist the expected `project_id` so the transport layer stays aligned with the model invariant.

## Implementation Result

- `apps/tasks/models.py` already enforced exactly-one-project ownership through a non-null `project` foreign key and per-project numbering constraints.
- `backend/tests/integration/test_tasks_api.py` now asserts:
  - direct task persistence without a project fails with `IntegrityError`
  - normal API-backed task creation persists the created task against the requested project

## Definition Of Done

- The task model does not allow a task without a project.
- The ownership invariant is covered by automated regression tests at both direct persistence and API-backed creation paths.
- The local story reflects the actual invariant scope instead of the copied dependency-management breakdown.
