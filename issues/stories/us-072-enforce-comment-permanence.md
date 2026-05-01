# US-072 - Enforce Comment Permanence  ## Metadata - Area: 22. Key Invariant Coverage - GitHub labels: `user-story`, `mvp`, `area:invariants` - Suggested status: `Backlog` - Suggested wave: `Wave 4` - Depends on: US-033 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system owner  
**I want** comments to remain permanent  
**So that** collaboration history is preserved.

### Acceptance Criteria

**Given** a comment has been created  
**When** users interact with the application  
**Then** there is no supported normal flow to edit or delete the comment.


# Traceability Summary

These user stories cover the major MVP areas:

- Authentication and password reset
- Admin user management
- Projects and memberships
- Roles and permissions
- Tasks, subtasks, dependencies, and workflow rules
- Kanban, Gantt, and My Tasks
- Comments, WebSockets, notifications, and activity logs
- Search, filtering, pagination, optimistic locking
- Security, session handling, CSRF, rate limiting
- Soft deletion, audit preservation, backup, and recovery
- MVP non-goals and key invariants  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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
