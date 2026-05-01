# US-050 - Gantt Conflict Warning  ## Metadata - Area: 14. Gantt Chart - GitHub labels: `user-story`, `mvp`, `area:gantt` - Suggested status: `Backlog` - Suggested wave: `Wave 5` - Depends on: US-048, US-071 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** project member  
**I want** dependency date conflicts to be highlighted  
**So that** I can manually resolve schedule issues.

### Acceptance Criteria

**Given** task B depends on task A  
**And** task B starts before task A's deadline  
**When** the Gantt chart renders  
**Then** the affected task and dependency link show a warning.

**Given** conflicting dates are saved  
**When** the backend validates the task  
**Then** the system allows the save and does not auto-adjust dates.

**Given** a conflict exists  
**When** the warning is displayed  
**Then** the message says: `Task starts before its dependency is completed.`  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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
