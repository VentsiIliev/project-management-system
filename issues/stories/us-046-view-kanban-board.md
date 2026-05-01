# US-046 - View Kanban Board  ## Metadata - Area: 13. Kanban Board - GitHub labels: `user-story`, `mvp`, `area:kanban` - Suggested status: `Backlog` - Suggested wave: `Wave 5` - Depends on: US-017, US-026, US-045 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** project member  
**I want** to view tasks on a Kanban board  
**So that** I can understand workflow status visually.

### Acceptance Criteria

**Given** I open a project Kanban board  
**When** tasks are loaded  
**Then** columns are ordered by status sort order.

**Given** tasks exist in each status  
**When** the board renders  
**Then** task cards are grouped by status.

**Given** a task is blocked or overdue  
**When** the task card renders  
**Then** the appropriate indicator is shown.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm task read models expose all fields needed for board/timeline rendering.
- [ ] Add query indexes needed for board and My Tasks performance.

### Backend/API
- [ ] Create optimized endpoints/read serializers for Kanban, Gantt, and My Tasks views.
- [ ] Return blocked, overdue, inactive status, dependency links, conflict warnings, and subtask grouping.
- [ ] Ensure mutations still go through canonical task/status endpoints.

### Frontend/UI
- [ ] Build Kanban columns ordered by status sort_order with drag/drop validation and snapback.
- [ ] Build read-only Gantt timeline with dependency links and conflict warnings.
- [ ] Build My Tasks view with assigned/collaborator options and deadline/priority sorting.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Frontend tests for board rendering, drag rejection, Gantt click behavior, and My Tasks sorting.
- [ ] Integration test status endpoint is called on successful Kanban moves only.

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
