# US-064 - Redis Recovery Behavior  ## Metadata - Area: 20. Backup, Recovery, and Operations - GitHub labels: `user-story`, `mvp`, `area:operations` - Suggested status: `Backlog` - Suggested wave: `Wave 6` - Depends on: US-035 - Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.  ## User Story **As a** user  
**I want** Redis loss to avoid durable data loss  
**So that** comments and tasks remain safe.

### Acceptance Criteria

**Given** Redis becomes unavailable  
**When** active WebSocket connections disconnect  
**Then** no durable business data is lost.

**Given** Redis is restored  
**When** clients reconnect  
**Then** users resume comment updates through the reconnection flow.  ## Implementation Breakdown **Kanban lane:** Backlog â†’ Ready â†’ Red â†’ Green â†’ Refactor â†’ Review / QA â†’ Done  
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
