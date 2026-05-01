# US-068 - No Cross-Project Dependencies  ## Metadata - Area: 21. MVP Boundary Stories - GitHub labels: `user-story`, `mvp`, `area:mvp-boundary` - Suggested status: `Backlog` - Suggested wave: `Wave 4` - Depends on: US-029 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** system  
**I want** dependencies limited to the same project  
**So that** dependency management stays predictable.

### Acceptance Criteria

**Given** tasks are in different projects  
**When** a user attempts to create a dependency between them  
**Then** the system rejects the dependency.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Unit test immutable code, date validation, and soft-delete behavior.
- [ ] Integration test project CRUD and deleted-project exclusion from normal views.

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
