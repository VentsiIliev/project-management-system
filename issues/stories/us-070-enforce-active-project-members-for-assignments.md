# US-070 - Enforce Active Project Members for Assignments  ## Metadata - Area: 22. Key Invariant Coverage - GitHub labels: `user-story`, `mvp`, `area:invariants` - Suggested status: `Backlog` - Suggested wave: `Wave 3` - Depends on: US-014, US-017 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system  
**I want** assignees and collaborators to be active project members  
**So that** tasks are assigned only to valid participants.

### Acceptance Criteria

**Given** a manager assigns a user to a task  
**When** the user is not an active project member  
**Then** the system rejects the assignment.

**Given** a collaborator is added  
**When** the user is not an active project member  
**Then** the system rejects the collaborator update.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test membership role constraints and soft-deleted membership access loss.
- [ ] Integration test add, role change, removal, and access revocation.

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
