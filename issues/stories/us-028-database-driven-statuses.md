# US-028 - Database-Driven Statuses  ## Metadata - Area: 7. Statuses and Workflow - GitHub labels: `user-story`, `mvp`, `area:workflow` - Suggested status: `Backlog` - Suggested wave: `Wave 0` - Depends on: US-017 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As an** Admin  
**I want** task statuses to be database-driven  
**So that** workflow metadata can evolve over time.

### Acceptance Criteria

**Given** a status is active  
**When** Kanban is rendered  
**Then** the status appears as a column ordered by `sort_order`.

**Given** a status is inactive  
**When** Kanban is rendered  
**Then** the column still appears and is visually marked inactive.

**Given** a status is inactive  
**When** a user attempts to drop a task into that column  
**Then** the move is rejected.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD â€” Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD â€” Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.
