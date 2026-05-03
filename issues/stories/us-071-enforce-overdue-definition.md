# US-071 - Enforce Overdue Definition

## Metadata

- Area: 22. Key Invariant Coverage
- GitHub labels: `user-story`, `mvp`, `area:invariants`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 3`
- Depends on: `US-019`, `US-026`
- Parallelization note: Implement with task detail and status change. Overdue is a read-model rule derived from deadline plus final status.

## User Story

**As a** user  
**I want** overdue tasks to be calculated consistently  
**So that** urgency is clear.

## Acceptance Criteria

**Given** a task deadline is before today  
**And** the task status is not final  
**When** the task is viewed  
**Then** the task is marked overdue.

**Given** a task has no deadline  
**When** the task is viewed  
**Then** the task is not overdue.

**Given** a task is in a final status  
**When** the task is viewed  
**Then** the task is not overdue even if the deadline is in the past.

## Current Slice Notes

- Overdue is computed, not stored.
- This belongs in the task read serializer and list/detail read models, not in a migration or status mutation side table.

## Execution Breakdown

### Backend Read Rule

- [ ] Compute `is_overdue` from `deadline < today` and `status.is_final == false`.
- [ ] Return the computed value in task list and task detail responses.

### Frontend Read Rule

- [ ] Render overdue state consistently in the project task list and task detail view.
- [ ] Do not mark final-status tasks overdue even if their deadline is in the past.

### Tests

- [ ] Add backend integration coverage for overdue, non-overdue, and final-status non-overdue cases.
- [ ] Add frontend coverage for overdue rendering.

## Definition Of Done

- Overdue state is derived consistently in backend read models.
- Task list and task detail both expose and render the same overdue rule.
