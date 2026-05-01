---
name: backend-planning
description: Plan backend delivery from the repository's product specs and local backlog. Use when Codex needs to turn product requirements, user stories, or issue files into Django module boundaries, data models, API contracts, authorization rules, workflow logic, concurrency rules, or backend implementation slices for this project-management system.
---

# Backend Planning

Use this skill to convert the repository's planning artifacts into backend-ready work.

## Workflow

1. Read the relevant source in this order:
- `docs/planning/project_spec_v4-1.md` for architecture, data rules, API design, security, and invariants
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` for the concrete backend stack and module structure
- `docs/planning/project_management_user_stories.md` for acceptance criteria
- `issues/story-index.md` plus the relevant `issues/stories/*.md` file for execution detail
2. Identify the owning backend module before proposing tasks.
3. Break the work into:
- schema or reference-data changes
- service/domain logic
- API or WebSocket behavior
- permissions and invariants
- transaction and concurrency handling
- test slices
4. Keep responsibilities in the modular monolith explicit. If a story touches multiple modules, define the orchestration boundary.
5. Prefer invariant-first planning. If a story can violate project, status, dependency, or membership rules, address those rules before endpoint details.

## Backend Defaults For This Repo

- Treat Django plus DRF as the API stack.
- Use Python 3.12, Django 5.x, DRF, Channels, PostgreSQL 16, Redis 7, pytest, and factory-based test data unless an explicit exception is approved.
- Treat Channels/WebSockets as comments-first real-time infrastructure.
- Respect soft delete, audit preservation, and project-scoped ownership rules.
- Use transactions for numbering, dependency validation, and critical status changes.
- Centralize permission logic rather than scattering it across handlers.

## Feature Areas

- Auth and sessions:
Keep authentication flow, forced reset, CSRF, and rate limiting clearly separated.
- Tasks and workflow:
Separate CRUD, numbering, status transitions, subtasks, dependencies, and blocked-state calculation.
- Notifications and activity logs:
Plan triggers as backend side effects, not frontend responsibilities.
- Operations:
Keep backups, Redis recovery, and other operational stories distinct from CRUD behavior.

## Output Shape

When producing a backend plan, prefer:

1. Scope summary
2. Owning modules and entities
3. API/events/contract impact
4. Invariants and race conditions
5. Parallelizable implementation tasks

## References

- Read `../../docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` when you need the approved backend stack or repository layout.
- Read `references/backend-planning-checklist.md` when you need a compact planning checklist for this repository.
