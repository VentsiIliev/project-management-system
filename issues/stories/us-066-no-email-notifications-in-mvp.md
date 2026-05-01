# US-066 - No Email Notifications in MVP  ## Metadata - Area: 21. MVP Boundary Stories - GitHub labels: `user-story`, `mvp`, `area:mvp-boundary` - Suggested status: `Backlog` - Suggested wave: `Wave 6` - Depends on: US-037 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** product owner  
**I want** notifications to be in-app only for MVP  
**So that** scope remains manageable.

### Acceptance Criteria

**Given** a task event occurs  
**When** notifications are created  
**Then** only in-app notifications are generated.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create notification table with UUID, user, type, JSON payload, read flag, created_at, and indexes.
- [ ] Ensure notification list supports pagination and unread filtering.

### Backend/API
- [ ] Implement synchronous notification service and recipient resolver.
- [ ] Exclude actor and removed project members from recipients.
- [ ] Implement list, mark-read, and read-all endpoints.

### Frontend/UI
- [ ] Build notification center/list with newest-first ordering, unread state, empty state, pagination.
- [ ] Add mark-one and mark-all read actions.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test recipient selection and actor exclusion.
- [ ] Integration test notification creation and read-state updates.

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
