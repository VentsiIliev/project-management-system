# US-045 - Paginated Lists  ## Metadata - Area: 12. Search, Filtering, and Pagination - GitHub labels: `user-story`, `mvp`, `area:search` - Suggested status: `Backlog` - Suggested wave: `Wave 5` - Depends on: US-011, US-019 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** user  
**I want** list results to be paginated  
**So that** large datasets remain usable.

### Acceptance Criteria

**Given** I request a list endpoint  
**When** the response is returned  
**Then** the response includes results and pagination metadata.

**Given** I request a specific page and page size  
**When** results are returned  
**Then** the system respects those pagination parameters.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Add/verify indexes for task_key, title, status, priority, assignee, deadline, deleted_at.
- [ ] Ensure list queries exclude soft-deleted rows by default.

### Backend/API
- [ ] Implement per-project task search over title, description, task_key.
- [ ] Implement filters for status, priority, assignee, deadline range, and blocked state.
- [ ] Standardize pagination response for all list endpoints.

### Frontend/UI
- [ ] Build search and filter controls with combined query support.
- [ ] Build pagination controls and empty-state handling.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit/integration test scoped search, combined filters, pagination metadata, and permission scoping.

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
