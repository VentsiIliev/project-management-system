---
name: backend-implementation
description: Implement backend code for this repository's approved architecture and backlog. Use when Codex needs to build or modify Django modules, models, services, policies, API views, serializers, WebSocket behavior, notifications, activity logging, transactions, or backend tests for a specific story in this project-management system.
---

# Backend Implementation

Use this skill when the task should result in backend code, migrations, tests, or concrete file changes.

## Workflow

1. Read the source in this order:
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/architecture/CODING_STANDARDS.md`
- the relevant issue file under `issues/stories/` or `issues/epics/`
- `docs/planning/project_spec_v4-1.md` for data rules, APIs, permissions, invariants, or concurrency behavior
2. Identify the owning module before editing files.
3. Implement in thin vertical slices:
- model or schema change
- domain service or validator
- policy or permission change
- API or WebSocket transport layer
- tests
4. Keep business rules in services and validators, not in views.
5. If the story touches multiple modules, define the orchestration boundary clearly rather than leaking logic across apps.

## Implementation Defaults

- Use Python 3.12.
- Use Django 5.x and DRF.
- Use Channels only where the story truly needs WebSockets.
- Use PostgreSQL semantics as the source of truth for data behavior.
- Use Redis for realtime and ephemeral infrastructure concerns.
- Use pytest and pytest-django for tests.

## File Placement

- Put transport code in `backend/apps/<module>/api/`.
- Put business logic in `backend/apps/<module>/domain/`.
- Put read-query composition in `selectors.py`.
- Put persistence helpers in `repositories.py` only when needed.
- Put module-local tests under the module or shared integration/concurrency tests under `backend/tests/`.

## Implementation Rules

1. Keep serializers and views thin.
2. Centralize permission logic in policies.
3. Keep project-specific business rules in the owning module rather than forcing them into generic shared helpers.
4. Promote infrastructure helpers to shared locations only when they serve multiple modules without feature-specific branching.
5. Use transactions for numbering, dependency validation, and critical workflow transitions.
6. Treat audit logging and notifications as backend side effects.
7. Enforce invariants server-side even if the frontend already hides invalid actions.
8. Keep soft-delete behavior explicit in reads and writes.

## High-Risk Areas

1. Task numbering
2. Status transitions
3. Dependency cycle prevention
4. Blocked-state calculation
5. Assignment and membership validity
6. Optimistic locking

## Required Checks

1. Acceptance criteria map to tests.
2. Permissions are enforced on the backend.
3. Structured errors remain consistent.
4. Transactions or locks are used where race conditions matter.
5. Query behavior respects soft-delete and project ownership rules.

## References

- Read `../../docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` for the approved stack and module layout.
- Read `../../docs/architecture/CODING_STANDARDS.md` for the shared coding and reuse rules.
- Read `references/backend-implementation-checklist.md` for a compact execution checklist.
