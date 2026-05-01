# US-034 - Immutable Comments  ## Metadata - Area: 9. Comments and Real-Time Updates - GitHub labels: `user-story`, `mvp`, `area:comments` - Suggested status: `Backlog` - Suggested wave: `Wave 4` - Depends on: US-033 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system  
**I want** comments to be immutable  
**So that** discussion history is preserved.

### Acceptance Criteria

**Given** a comment exists  
**When** a user attempts to edit or delete it  
**Then** no edit or delete endpoint is available.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create comments table with UUID, task, author, content, created_at; no edit/delete columns or flows.
- [ ] Ensure comment FK behavior preserves expected task/task-history semantics.

### Backend/API
- [ ] Implement comments GET/POST endpoints.
- [ ] Reject empty comments and enforce task access.
- [ ] Persist comment before WebSocket broadcast.
- [ ] Publish comment events to authorized task viewers only.
- [ ] Trigger notifications and activity logs on comment creation.

### Frontend/UI
- [ ] Build comment composer and immutable comment timeline.
- [ ] Connect to task comment WebSocket channel.
- [ ] Implement reconnect indicator, exponential backoff, and missed-comment fetch.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

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
