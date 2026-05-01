# US-029 - Add Dependency  ## Metadata - Area: 8. Dependencies and Blocking - GitHub labels: `user-story`, `mvp`, `area:dependencies` - Suggested status: `Backlog` - Suggested wave: `Wave 4` - Depends on: US-017, US-030, US-069 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As an** Admin or Project Manager  
**I want** to add dependencies between tasks  
**So that** blocked work is tracked.

### Acceptance Criteria

**Given** I have permission to manage dependencies  
**When** I add a dependency between two tasks in the same project  
**Then** the system records the dependency.

**Given** the tasks belong to different projects  
**When** I add the dependency  
**Then** the system rejects the request with `CROSS_PROJECT_DEPENDENCY`.

**Given** the dependency already exists  
**When** I add the same dependency again  
**Then** the system rejects the request with `DUPLICATE_DEPENDENCY`.

**Given** the dependency points a task to itself  
**When** I submit the request  
**Then** the system rejects it.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

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
