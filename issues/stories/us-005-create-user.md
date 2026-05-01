# US-005 - Create User  ## Metadata - Area: 2. Admin User Management - GitHub labels: `user-story`, `mvp`, `area:admin` - Suggested status: `Backlog` - Suggested wave: `Wave 0` - Depends on: US-001 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As an** Admin  
**I want** to create user accounts  
**So that** employees can access the system.

### Acceptance Criteria

**Given** I am an Admin  
**When** I create a user with name, unique email, and valid temporary password  
**Then** the system creates an active user with `must_reset_password = true`.

**Given** the email is already used  
**When** I attempt to create the user  
**Then** the system rejects the request with a validation error.

**Given** I am not an Admin  
**When** I attempt to create a user  
**Then** the system denies permission.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/update user schema with UUID primary key, unique email, active flag, admin flag, reset flag, timestamps, soft delete.
- [ ] Add migration and database constraints for required user fields.

### Backend/API
- [ ] Implement admin-only user endpoint/service logic.
- [ ] Validate email uniqueness and password policy where relevant.
- [ ] Apply soft-delete/deactivation rules without cascading assignment deletion.
- [ ] Create activity/application logs for user management events.

### Frontend/UI
- [ ] Build admin user management form/table action states.
- [ ] Show success/error feedback for create, update, deactivate, and reset operations.

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission tests for admin-only access.
- [ ] Integration tests for user create/update/deactivate/reset flows.
- [ ] Regression tests that inactive/deleted users cannot log in.

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
