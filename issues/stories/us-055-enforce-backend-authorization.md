# US-055 - Enforce Backend Authorization  ## Metadata - Area: 17. Authorization and Security - GitHub labels: `user-story`, `mvp`, `area:security` - Suggested status: `Backlog` - Suggested wave: `Wave 0` - Depends on: US-001 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system  
**I want** every API endpoint to enforce permissions server-side  
**So that** hidden frontend actions cannot bypass security.

### Acceptance Criteria

**Given** a user sends a request to any protected endpoint  
**When** the request is processed  
**Then** the backend verifies authentication, account status, project membership, role, and requested action.

**Given** frontend UI hides an action  
**When** a user calls the API directly  
**Then** backend permissions are still enforced.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Ensure membership and user state data supports fast authorization checks.

### Backend/API
- [ ] Centralize authorization policy for Admin, Project Manager, Team Member, and non-member.
- [ ] Apply server-side checks to every protected endpoint.
- [ ] Allow admin override for role restrictions while still enforcing invariants.
- [ ] Return 403/404 according to unauthorized resource exposure policy.

### Frontend/UI
- [ ] Hide forbidden actions while preserving backend as source of truth.
- [ ] Show permission denied state for rejected actions.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission matrix tests for each role and protected action.
- [ ] Admin override tests that still reject invalid hierarchy/dependencies.

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
