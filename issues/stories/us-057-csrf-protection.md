# US-057 - CSRF Protection  ## Metadata - Area: 17. Authorization and Security - GitHub labels: `user-story`, `mvp`, `area:security` - Suggested status: `Backlog` - Suggested wave: `Wave 1` - Depends on: US-001 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system  
**I want** unsafe authenticated requests to require CSRF protection  
**So that** session-based authentication is protected.

### Acceptance Criteria

**Given** a user submits POST, PATCH, PUT, or DELETE  
**When** the CSRF token is missing or invalid  
**Then** the request is rejected.

**Given** the CSRF token is valid  
**When** the unsafe request is submitted  
**Then** normal authentication and authorization checks continue.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm user fields support auth state: `is_active`, `deleted_at`, `must_reset_password`, `last_login_at`.
- [ ] Add indexes/constraints required for email uniqueness and active-user lookup.

### Backend/API
- [ ] Implement/validate session endpoint behavior and generic auth errors.
- [ ] Enforce active, non-deleted user checks before creating sessions.
- [ ] Add service-level handling for `must_reset_password` and allowed endpoints.
- [ ] Emit application logs for security-relevant auth events.

### Frontend/UI
- [ ] Build guarded route behavior for authenticated, unauthenticated, and reset-required users.
- [ ] Display validation, generic credential, expired-session, and rate-limit states.
- [ ] Attach CSRF tokens and credentials on unsafe requests.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### DevOps/Config
- [ ] Configure secure cookie settings and rate-limit middleware for production/staging.

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
