# Project Management App — TDD Layered Implementation Kanban Tasks
Source inputs: `project_spec_v4-1.md` and `project_management_user_stories.md`.
This board breaks each user story into implementation tasks by layer and makes **test-driven development (TDD)** the default workflow for every story.

## Board Columns
- **Backlog** — story exists but test cases and implementation slices are not yet refined
- **Ready** — acceptance criteria are clear and test cases are identified
- **Red** — failing automated tests are written first
- **Green** — minimum implementation is added to pass tests
- **Refactor** — code is cleaned up while tests stay passing
- **Review / QA** — code complete, reviewed, regression-tested, and accepted
- **Done** — merged, documented, deployed or ready for release

## TDD Rules for Every User Story
1. Start from the Given/When/Then acceptance criteria.
2. Convert each acceptance criterion into automated tests before implementation.
3. Run tests and confirm they fail for the expected reason (**Red**).
4. Implement the smallest change needed to pass (**Green**).
5. Refactor while keeping tests passing.
6. Add regression tests for bugs found during review.
7. A story is not Done unless tests cover happy paths, permission failures, validation failures, and key edge cases.

## Test Pyramid
- **Unit tests**: models, services, validators, permissions, transitions, computed fields.
- **Integration/API tests**: REST endpoints, sessions, CSRF, optimistic locking, pagination, transactions.
- **Frontend tests**: route guards, forms, error states, Kanban behavior, Gantt warnings, notifications.
- **End-to-end tests**: critical flows only.
- **Contract tests**: API response shapes, standard errors, pagination, WebSocket payloads.

## Status Legend
Use checkboxes as task status: `[ ]` not started, `[~]` in progress, `[x]` done.

# Authentication & Security

## US-001 — User Login
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-002 — Forced First-Login Password Reset
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-003 — Logout
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-004 — Session Expiration
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### DevOps/Config
- [ ] Configure secure cookie settings and rate-limit middleware for production/staging.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-007 — Reset User Password
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-057 — CSRF Protection
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### DevOps/Config
- [ ] Configure secure cookie settings and rate-limit middleware for production/staging.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-058 — Rate-Limit Authentication Endpoints
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### DevOps/Config
- [ ] Configure secure cookie settings and rate-limit middleware for production/staging.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-065 — No Public Registration
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test valid/invalid credentials, inactive users, deleted users, and reset-required users.
- [ ] Integration test full browser/API auth flow and session expiry behavior.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# User Administration

## US-005 — Create User
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission tests for admin-only access.
- [ ] Integration tests for user create/update/deactivate/reset flows.
- [ ] Regression tests that inactive/deleted users cannot log in.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-006 — Update User
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission tests for admin-only access.
- [ ] Integration tests for user create/update/deactivate/reset flows.
- [ ] Regression tests that inactive/deleted users cannot log in.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-008 — Deactivate User
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission tests for admin-only access.
- [ ] Integration tests for user create/update/deactivate/reset flows.
- [ ] Regression tests that inactive/deleted users cannot log in.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Projects

## US-009 — Create Project
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-010 — Immutable Project Code
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-011 — View Project
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-012 — Edit Project
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-013 — Delete Project With Confirmation
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-042 — View Project Activity
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-043 — Search Project Tasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-044 — Filter Project Tasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-068 — No Cross-Project Dependencies
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain project schema with UUID, owner, immutable code, task counter, dates, and soft delete.
- [ ] Add unique/index constraints for project code and owner lookups.

### Backend/API
- [ ] Implement project endpoints with pagination and permission checks.
- [ ] Enforce immutable project code on PATCH.
- [ ] Validate project date ranges.
- [ ] Soft-delete project, tasks, subtasks, memberships, dependencies visibility with confirmation flag.
- [ ] Write project activity logs.

### Frontend/UI
- [ ] Build project create/edit/detail/list UI.
- [ ] Prevent code editing after creation in the UI.
- [ ] Show destructive delete confirmation text exactly as specified.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Project Memberships

## US-014 — Add Project Member
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain `project_memberships` table with role enum, unique project-user pair, timestamps, and soft delete.
- [ ] Add indexes for permission lookup by project and user.

### Backend/API
- [ ] Implement membership CRUD endpoints with Project Manager/Admin permissions.
- [ ] Ignore soft-deleted memberships in all authorization checks.
- [ ] Preserve task assignments when a member is removed and label removed users in read models.
- [ ] Emit member activity logs.

### Frontend/UI
- [ ] Build member management UI with role selector and remove confirmation.
- [ ] Hide member actions for users without permission.
- [ ] Display removed/inactive assignment labels where relevant.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-015 — Change Project Member Role
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain `project_memberships` table with role enum, unique project-user pair, timestamps, and soft delete.
- [ ] Add indexes for permission lookup by project and user.

### Backend/API
- [ ] Implement membership CRUD endpoints with Project Manager/Admin permissions.
- [ ] Ignore soft-deleted memberships in all authorization checks.
- [ ] Preserve task assignments when a member is removed and label removed users in read models.
- [ ] Emit member activity logs.

### Frontend/UI
- [ ] Build member management UI with role selector and remove confirmation.
- [ ] Hide member actions for users without permission.
- [ ] Display removed/inactive assignment labels where relevant.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-016 — Remove Project Member
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain `project_memberships` table with role enum, unique project-user pair, timestamps, and soft delete.
- [ ] Add indexes for permission lookup by project and user.

### Backend/API
- [ ] Implement membership CRUD endpoints with Project Manager/Admin permissions.
- [ ] Ignore soft-deleted memberships in all authorization checks.
- [ ] Preserve task assignments when a member is removed and label removed users in read models.
- [ ] Emit member activity logs.

### Frontend/UI
- [ ] Build member management UI with role selector and remove confirmation.
- [ ] Hide member actions for users without permission.
- [ ] Display removed/inactive assignment labels where relevant.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-021 — Team Member Updates Task Description
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain `project_memberships` table with role enum, unique project-user pair, timestamps, and soft delete.
- [ ] Add indexes for permission lookup by project and user.

### Backend/API
- [ ] Implement membership CRUD endpoints with Project Manager/Admin permissions.
- [ ] Ignore soft-deleted memberships in all authorization checks.
- [ ] Preserve task assignments when a member is removed and label removed users in read models.
- [ ] Emit member activity logs.

### Frontend/UI
- [ ] Build member management UI with role selector and remove confirmation.
- [ ] Hide member actions for users without permission.
- [ ] Display removed/inactive assignment labels where relevant.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-070 — Enforce Active Project Members for Assignments
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain `project_memberships` table with role enum, unique project-user pair, timestamps, and soft delete.
- [ ] Add indexes for permission lookup by project and user.

### Backend/API
- [ ] Implement membership CRUD endpoints with Project Manager/Admin permissions.
- [ ] Ignore soft-deleted memberships in all authorization checks.
- [ ] Preserve task assignments when a member is removed and label removed users in read models.
- [ ] Emit member activity logs.

### Frontend/UI
- [ ] Build member management UI with role selector and remove confirmation.
- [ ] Hide member actions for users without permission.
- [ ] Display removed/inactive assignment labels where relevant.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Tasks & Workflow

## US-017 — Create Task
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-018 — Atomic Task Numbering
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-019 — View Task
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-020 — Update Task Planning Fields
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-022 — Delete Task
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-023 — Create Subtask
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-024 — Parent Completion Requires Completed Subtasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-025 — Reopen Parent When Subtask Reopens
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-026 — Change Task Status
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-027 — Prevent Blocked Task Progression
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-028 — Database-Driven Statuses
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-029 — Add Dependency
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-031 — Compute Blocked State
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-032 — Remove Dependency
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-037 — Receive Task Notifications
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-040 — Record Task Activity
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-041 — View Task Activity
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-047 — Drag Task Between Kanban Columns
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-051 — View My Assigned Tasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-052 — Sort My Tasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-054 — View Workflow Metadata
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-059 — Handle Optimistic Lock Conflict
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-061 — Hide Soft-Deleted Tasks
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-069 — Enforce Task-Project Ownership
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task dependency table with unique pair and no-self check.
- [ ] Add indexes for dependency and reverse-dependency lookup.

### Backend/API
- [ ] Implement dependency add/remove/list service inside a transaction.
- [ ] Validate same-project dependencies, no duplicates, no self-dependency, and acyclic graph.
- [ ] Compute blocked state from non-final dependency statuses; never store BLOCKED as a status.
- [ ] Block invalid status changes when dependencies are unresolved.

### Frontend/UI
- [ ] Show blocked indicators on task detail, Kanban, Gantt, and My Tasks.
- [ ] Disable/rollback UI actions that violate dependency rules.
- [ ] Display structured dependency errors and Gantt conflict warnings.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test same-project, duplicate, self, and circular dependency rejection.
- [ ] Integration test blocked status transition behavior and dependency race conditions.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-071 — Enforce Overdue Definition
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Create/maintain task, status, status transition, priority, collaborator schema as required.
- [ ] Add UUID keys, task number uniqueness, version field, indexes, date checks, and FK rules.

### Backend/API
- [ ] Implement task create/read/update/delete/status endpoints.
- [ ] Generate task numbers atomically and task keys from immutable project code.
- [ ] Enforce role-based field permissions and assignment/collaborator membership rules.
- [ ] Enforce one-level subtask hierarchy, parent completion, parent auto-reopen, and overdue calculation.
- [ ] Require optimistic version on mutating task endpoints and return structured conflicts.
- [ ] Emit activity logs and notifications for task mutations.

### Frontend/UI
- [ ] Build task forms, detail view, edit controls, status actions, subtask display, assignment controls.
- [ ] Render blocked/overdue/priority/status/assignee/task-key data consistently.
- [ ] Handle optimistic locking refresh-and-retry UX.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test task validation, hierarchy, status transitions, overdue, assignment membership, and optimistic locking.
- [ ] Integration test task creation/update/delete/status flows and concurrent mutations.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# General MVP Constraints

## US-030 — Prevent Circular Dependencies
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm no schema is added for explicitly non-MVP capability.

### Backend/API
- [ ] Reject or omit endpoints for non-goal capability.
- [ ] Document future-scope decision in code/API docs where useful.

### Frontend/UI
- [ ] Do not expose UI entry points for non-MVP capability.
- [ ] Show no misleading controls for unsupported features.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Regression test unsupported capability is not available in MVP.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-053 — Use Database-Driven Priorities
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm no schema is added for explicitly non-MVP capability.

### Backend/API
- [ ] Reject or omit endpoints for non-goal capability.
- [ ] Document future-scope decision in code/API docs where useful.

### Frontend/UI
- [ ] Do not expose UI entry points for non-MVP capability.
- [ ] Show no misleading controls for unsupported features.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Regression test unsupported capability is not available in MVP.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-060 — Handle Loading, Empty, and Error States
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm no schema is added for explicitly non-MVP capability.

### Backend/API
- [ ] Reject or omit endpoints for non-goal capability.
- [ ] Document future-scope decision in code/API docs where useful.

### Frontend/UI
- [ ] Do not expose UI entry points for non-MVP capability.
- [ ] Show no misleading controls for unsupported features.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Regression test unsupported capability is not available in MVP.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-067 — No Attachments in MVP
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Confirm no schema is added for explicitly non-MVP capability.

### Backend/API
- [ ] Reject or omit endpoints for non-goal capability.
- [ ] Document future-scope decision in code/API docs where useful.

### Frontend/UI
- [ ] Do not expose UI entry points for non-MVP capability.
- [ ] Show no misleading controls for unsupported features.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Regression test unsupported capability is not available in MVP.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Comments & Realtime

## US-033 — Add Comment
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-034 — Immutable Comments
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-035 — Real-Time Comment Broadcast
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-036 — WebSocket Reconnection
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-072 — Enforce Comment Permanence
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test comment immutability and authorization.
- [ ] Integration test REST comment creation, notification trigger, and WebSocket broadcast/reconnect.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Notifications

## US-038 — View Notifications
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test recipient selection and actor exclusion.
- [ ] Integration test notification creation and read-state updates.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-039 — Mark Notifications Read
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test recipient selection and actor exclusion.
- [ ] Integration test notification creation and read-state updates.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-066 — No Email Notifications in MVP
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test recipient selection and actor exclusion.
- [ ] Integration test notification creation and read-state updates.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Search, Filtering & Pagination

## US-045 — Paginated Lists
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit/integration test scoped search, combined filters, pagination metadata, and permission scoping.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Frontend Boards & Views

## US-046 — View Kanban Board
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Frontend tests for board rendering, drag rejection, Gantt click behavior, and My Tasks sorting.
- [ ] Integration test status endpoint is called on successful Kanban moves only.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-048 — View Gantt Timeline
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Frontend tests for board rendering, drag rejection, Gantt click behavior, and My Tasks sorting.
- [ ] Integration test status endpoint is called on successful Kanban moves only.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-049 — Read-Only Gantt Interaction
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Frontend tests for board rendering, drag rejection, Gantt click behavior, and My Tasks sorting.
- [ ] Integration test status endpoint is called on successful Kanban moves only.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-050 — Gantt Conflict Warning
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Frontend tests for board rendering, drag rejection, Gantt click behavior, and My Tasks sorting.
- [ ] Integration test status endpoint is called on successful Kanban moves only.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Authorization

## US-055 — Enforce Backend Authorization
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission matrix tests for each role and protected action.
- [ ] Admin override tests that still reject invalid hierarchy/dependencies.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-056 — Admin Override With Invariants
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
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

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Permission matrix tests for each role and protected action.
- [ ] Admin override tests that still reject invalid hierarchy/dependencies.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Data Lifecycle & Operations

## US-062 — Preserve Historical References
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Implement soft-delete convention and default managers/querysets that exclude deleted records.
- [ ] Define backup-compatible schema and no-durable-data Redis usage.

### Backend/API
- [ ] Apply soft-delete filtering across normal APIs, search, Kanban, Gantt, My Tasks, filters.
- [ ] Preserve historical references in logs and assignments.
- [ ] Document Redis reconnect behavior and backup/restore expectations.

### Frontend/UI
- [ ] Hide deleted records from normal views.
- [ ] Render inactive/deleted references in historical contexts without broken UI.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Integration test deleted records are hidden from normal APIs.
- [ ] Operational test backup restore and Redis restart/reconnect behavior.

### DevOps/Config
- [ ] Configure daily PostgreSQL backups with at least 7-day retention.
- [ ] Document/test restore procedure and Redis loss recovery.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-063 — Daily Database Backup
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Implement soft-delete convention and default managers/querysets that exclude deleted records.
- [ ] Define backup-compatible schema and no-durable-data Redis usage.

### Backend/API
- [ ] Apply soft-delete filtering across normal APIs, search, Kanban, Gantt, My Tasks, filters.
- [ ] Preserve historical references in logs and assignments.
- [ ] Document Redis reconnect behavior and backup/restore expectations.

### Frontend/UI
- [ ] Hide deleted records from normal views.
- [ ] Render inactive/deleted references in historical contexts without broken UI.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Integration test deleted records are hidden from normal APIs.
- [ ] Operational test backup restore and Redis restart/reconnect behavior.

### DevOps/Config
- [ ] Configure daily PostgreSQL backups with at least 7-day retention.
- [ ] Document/test restore procedure and Redis loss recovery.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

## US-064 — Redis Recovery Behavior
**Kanban lane:** Backlog → Ready → Red → Green → Refactor → Review / QA → Done  
**Definition of Done:** All listed layer tasks are complete, reviewed, tested, and traceable to the story acceptance criteria.

### Database
- [ ] Implement soft-delete convention and default managers/querysets that exclude deleted records.
- [ ] Define backup-compatible schema and no-durable-data Redis usage.

### Backend/API
- [ ] Apply soft-delete filtering across normal APIs, search, Kanban, Gantt, My Tasks, filters.
- [ ] Preserve historical references in logs and assignments.
- [ ] Document Redis reconnect behavior and backup/restore expectations.

### Frontend/UI
- [ ] Hide deleted records from normal views.
- [ ] Render inactive/deleted references in historical contexts without broken UI.

### TDD — Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Integration test deleted records are hidden from normal APIs.
- [ ] Operational test backup restore and Redis restart/reconnect behavior.

### DevOps/Config
- [ ] Configure daily PostgreSQL backups with at least 7-day retention.
- [ ] Document/test restore procedure and Redis loss recovery.

### TDD — Green: Implement Minimum Passing Code
- [ ] Implement only the smallest database/backend/frontend change needed to pass the failing tests.
- [ ] Run the story-level test set and confirm all new tests pass.
- [ ] Confirm existing regression tests still pass.

### TDD — Refactor: Improve Safely
- [ ] Refactor duplicated logic into services, validators, hooks, or shared components.
- [ ] Confirm permissions, structured errors, soft-delete behavior, and edge cases remain covered.
- [ ] Re-run unit, integration, and relevant frontend tests after refactoring.

### Review / QA Checklist
- [ ] Acceptance criteria from the user story are verified manually or by automated tests.
- [ ] Structured API errors, permissions, and edge cases are validated where applicable.
- [ ] Documentation or developer notes are updated if behavior is non-obvious.

# Cross-Cutting Implementation Epics

## Project Setup & Architecture
- [ ] Initialize Django modular monolith apps: users, projects, memberships, tasks, dependencies, comments, notifications, activity_logs.
- [ ] Initialize React SPA feature modules: auth, projects, tasks, kanban, gantt, notifications, admin, shared, api, components.
- [ ] Set up linting, formatting, type checks where applicable, and baseline CI commands.
- [ ] Create shared API error and pagination contracts used by backend and frontend.

## Database Baseline
- [ ] Use UUID primary keys across all domain tables.
- [ ] Create migrations for all MVP tables and seed default statuses/priorities/transitions.
- [ ] Add indexes listed in the spec for permissions, search, filtering, and board queries.
- [ ] Implement soft-delete convention consistently.

## Backend Baseline
- [ ] Centralize permission policy and apply it to every endpoint.
- [ ] Centralize activity-log writing and notification triggering in service layer.
- [ ] Use transactions for task numbering, dependency validation, and critical status changes.
- [ ] Apply pagination to every list endpoint.

## Frontend Baseline
- [ ] Create centralized API client with credentials, CSRF, structured error handling, and auth redirects.
- [ ] Implement shared loading, empty, validation error, permission denied, network error, conflict, and not-found states.
- [ ] Keep UI action visibility aligned with roles while relying on backend enforcement.

## Testing Baseline
- [ ] Create unit test suites for domain services and validators.
- [ ] Create API integration test suites for all endpoints.
- [ ] Create frontend component/flow tests for auth, task forms, Kanban, Gantt, notifications, and error states.
- [ ] Add concurrency tests for task numbering, optimistic locking, dependency races, and status/dependency races.

## Deployment & Operations
- [ ] Configure local, staging, and production environment settings.
- [ ] Configure PostgreSQL, Redis, Gunicorn, ASGI server, Nginx, static frontend serving, and HTTPS.
- [ ] Configure secure cookies, trusted origins, CORS, and CSRF for production.
- [ ] Configure application logs and daily PostgreSQL backups.
