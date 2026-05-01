# Implementation Architecture

This document is the execution contract for implementation agents. It turns the product spec into a concrete stack and codebase shape.

## Decision Status

- Status: approved working baseline
- Scope: MVP implementation guidance
- Priority: if this document conflicts with a looser planning artifact, implementation agents should follow this document and then update the backlog or spec to remove drift

## Tech Stack

### Backend

- Python `3.12`
- Django `5.x`
- Django REST Framework
- Django Channels
- PostgreSQL `16`
- Redis `7`
- `uv` or `pip-tools` for dependency locking
- `pytest` + `pytest-django` for tests
- `factory_boy` for test data

### Frontend

- TypeScript
- React `19`
- Vite
- React Router
- TanStack Query
- Zustand for local UI state only
- React Hook Form
- Zod for form and API-shape validation where useful
- `dnd-kit` for Kanban drag and drop
- Day.js for date handling
- Tailwind CSS for styling

### Realtime And Delivery

- WebSockets only for comments in MVP
- Polling or explicit refresh for task board updates outside comments
- Nginx as reverse proxy
- Gunicorn for WSGI HTTP app
- Daphne or Uvicorn for ASGI/WebSocket handling

### Testing

- Backend:
- unit tests for services, validators, permissions, transitions
- integration tests for API and transaction behavior
- Frontend:
- Vitest
- React Testing Library
- Playwright for critical end-to-end flows only

## Architecture Rules

### High-Level Shape

- Use a modular monolith backend.
- Use a single React SPA frontend.
- Keep domain rules on the backend.
- Keep frontend logic thin around API orchestration, state, and UX behavior.

### Backend Rules

1. Put business logic in services, not in views or serializers.
2. Keep permissions centralized in a dedicated policy layer.
3. Use transactions for task numbering, dependency checks, and critical status changes.
4. Treat audit logging and notifications as backend side effects.
5. Use UUIDs as public identifiers.
6. Enforce soft-delete behavior consistently through query patterns and managers.

### Frontend Rules

1. Organize by feature, not by file type alone.
2. Use TanStack Query for server state.
3. Use Zustand only for transient UI state that should not live in route state or query state.
4. Keep forms explicit and schema-backed when validation is non-trivial.
5. Treat Kanban drag/drop as a workflow action, not a UI-only change.
6. Treat Gantt as read-only in MVP.
7. Keep styling token-driven and easy to restyle later, as defined in `FRONTEND_STYLE_GUIDE.md`.

## Repository Target Shape

```text
project-management-system/
├── backend/
│   ├── apps/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── memberships/
│   │   ├── tasks/
│   │   ├── workflow/
│   │   ├── dependencies/
│   │   ├── comments/
│   │   ├── notifications/
│   │   └── activity_logs/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── local.py
│   │   │   ├── test.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── tests/
│   │   ├── integration/
│   │   ├── contracts/
│   │   └── concurrency/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── router/
│   │   │   ├── providers/
│   │   │   └── store/
│   │   ├── api/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── kanban/
│   │   │   ├── gantt/
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── test/
│   ├── public/
│   └── vite.config.ts
├── infra/
│   ├── nginx/
│   ├── systemd/
│   └── scripts/
├── issues/
├── skills/
└── README.md
```

## Structure To Standards Mapping

This section makes the repository shape consistent with `CODING_STANDARDS.md`.

### Frontend Ownership Mapping

- `frontend/src/app/` holds bootstrapping, routing, providers, and global wiring only.
- `frontend/src/features/` holds product-specific workflows, feature state, feature pages, and feature-owned UI behavior.
- `frontend/src/components/` holds reusable presentational building blocks that do not encode project-specific workflow rules.
- `frontend/src/lib/` holds shared technical helpers, validation, formatting, low-level hooks, and utilities with stable cross-feature reuse.
- `frontend/src/api/` holds transport wrappers and response mapping, not page-specific workflow logic.

Rules:

1. If a piece of frontend code contains business workflow meaning, keep it in `features/`.
2. Promote code to `components/` or `lib/` only when the contract is stable enough to serve multiple features in this project family.
3. Do not turn `components/` or `lib/` into dumping grounds for feature-specific branching.

### Backend Ownership Mapping

- `backend/apps/<module>/` owns project-specific domain behavior for that capability.
- `backend/apps/<module>/api/` owns transport and request or response mapping only.
- `backend/apps/<module>/domain/` owns business rules, policies, validators, and orchestration.
- `backend/tests/` holds cross-module integration, contract, and concurrency tests that do not belong to a single module.
- Shared backend helpers should remain technical and infrastructural unless a business abstraction is already stable across modules.

Rules:

1. Keep business rules in the owning backend module unless reuse is clearly stable and cross-module.
2. Share infrastructure and technical helpers broadly; share business rules cautiously.
3. Do not create generic shared backend libraries for project-specific policies or workflow logic.

### Reuse Boundary

- Reuse target: this project family
- Preferred pattern: small cohesive units with explicit contracts
- Extraction rule: move code to shared locations only when duplication is real and the abstraction is simpler than the duplication

When architecture and reuse pressure conflict, prefer keeping code closer to the owning feature or module until the shared contract is stable.

## Backend Module Shape

Each backend module should prefer this internal layout:

```text
apps/tasks/
├── api/
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── domain/
│   ├── services.py
│   ├── policies.py
│   ├── validators.py
│   └── events.py
├── models.py
├── selectors.py
├── repositories.py
└── tests/
```

Rules:

1. `api/` handles transport only.
2. `domain/` holds real business behavior.
3. `selectors.py` handles read-oriented query composition.
4. `repositories.py` is optional; use it when persistence complexity grows.
5. Avoid circular imports across modules; integrate through services or events.

## Frontend Feature Shape

Each frontend feature should prefer this internal layout:

```text
features/tasks/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── state/
└── utils/
```

Rules:

1. `api/` wraps HTTP calls and response mapping.
2. `hooks/` owns query and mutation composition.
3. `pages/` stay thin and orchestration-focused.
4. `components/` contain reusable feature UI.
5. `schemas/` hold Zod validation for forms and critical client-side contracts.

## Cross-Cutting Conventions

### API

- Keep REST endpoints project- or task-scoped as defined in the spec.
- Return stable structured error bodies.
- Version later only if real breaking changes appear; do not start with premature API versioning.

### Authorization

- Enforce authorization on the backend only.
- Mirror permissions in the frontend only for UX clarity.

### Events

- Use internal domain events for notifications, activity logs, and comment broadcasting.
- Do not let views directly orchestrate all side effects.

### Concurrency

- Use optimistic locking for task updates where defined in the spec.
- Lock or transact around counters and dependency-sensitive mutations.

## Out Of Scope For MVP

- Microservices
- GraphQL
- full real-time collaborative Kanban
- attachment storage pipeline
- email notification system
- mobile app client

## Agent Instructions

1. If an implementation task lacks a concrete stack choice, use the choices in this document.
2. If a story implies a structure that conflicts with this document, propose the exception explicitly before changing direction.
3. When generating code plans, reference this document, `CODING_STANDARDS.md`, and the relevant story issue.
4. When deciding whether code belongs in a feature or shared location, follow the ownership and reuse rules in the Structure To Standards Mapping section.
