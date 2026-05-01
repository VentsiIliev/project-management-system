# US-063 - Daily Database Backup  ## Metadata - Area: 20. Backup, Recovery, and Operations - GitHub labels: `user-story`, `mvp`, `area:operations` - Suggested status: `Backlog` - Suggested wave: `Wave 6` - Depends on: US-001 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As an** operator  
**I want** daily PostgreSQL backups  
**So that** durable data can be recovered.

### Acceptance Criteria

**Given** the system is in production  
**When** the backup schedule runs  
**Then** a PostgreSQL backup is created daily.

**Given** backups are created  
**When** retention is enforced  
**Then** backups are retained for at least 7 days.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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

### TDD â€” Red: Write Failing Tests First
- [ ] Map each Given/When/Then acceptance criterion to automated tests.
- [ ] Add happy-path tests before implementation.
- [ ] Add validation, permission, and edge-case tests before implementation.
- [ ] Run the tests and confirm they fail for the expected reason.
- [ ] Integration test deleted records are hidden from normal APIs.
- [ ] Operational test backup restore and Redis restart/reconnect behavior.

### DevOps/Config
- [ ] Configure daily PostgreSQL backups with at least 7-day retention.
- [ ] Document/test restore procedure and Redis loss recovery.

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
