# US-053 - Use Database-Driven Priorities  ## Metadata - Area: 16. Priorities and Metadata - GitHub labels: `user-story`, `mvp`, `area:metadata` - Suggested status: `Backlog` - Suggested wave: `Wave 0` - Depends on: US-017 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As an** Admin  
**I want** priorities to be database-driven  
**So that** priority options can be configured.

### Acceptance Criteria

**Given** an active priority exists  
**When** a manager creates or updates a task  
**Then** the priority can be assigned.

**Given** a priority is inactive  
**When** a manager creates a new task  
**Then** the inactive priority cannot be assigned.

**Given** an existing task references an inactive priority  
**When** the task is viewed  
**Then** the inactive priority remains visible.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm no schema is added for explicitly non-MVP capability.

### Backend/API
- [ ] Reject or omit endpoints for non-goal capability.
- [ ] Document future-scope decision in code/API docs where useful.

### Frontend/UI
- [ ] Do not expose UI entry points for non-MVP capability.
- [ ] Show no misleading controls for unsupported features.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Regression test unsupported capability is not available in MVP.

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
