# Agents

This repository is planning-first. Agents working here should treat the Markdown specification and backlog files as the primary product.

## Operating Rules

1. Use `docs/planning/project_spec_v4-1.md` as the architecture and system-rules source.
2. Use `docs/planning/project_management_user_stories.md` as the acceptance-criteria source.
3. Use `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` as the concrete stack and project-structure source.
4. Use `docs/architecture/CODING_STANDARDS.md` as the coding and reuse policy source.
5. Use `docs/architecture/FRONTEND_STYLE_GUIDE.md` as the frontend styling and customization policy source.
6. Use the `issues/` folder as the working execution backlog.
7. Use the `skills/` folder as the local agent workspace for behavior, checklists, and durable context.
8. Do not create new backlog artifacts outside `issues/` unless there is a strong reason.
9. Prefer tightening dependencies, acceptance criteria, and implementation slices before adding more scope.
10. When a planning artifact conflicts with another, update the working backlog and record the conflict in `issues/review-findings.md`.
11. When a reusable pattern, decision, or handoff note will help future work, record it under `skills/context/` instead of leaving it implicit in chat history.
12. Keep the local `issues/` backlog and GitHub issues in sync using `issues/sync-policy.md`.
13. Use `issues/github-label-policy.md` for the active GitHub label names.
14. Agents may mark work as implemented or owner-review, but only the repository owner may mark work done or reviewed.
15. After finishing an issue implementation slice and syncing its issue state, agents should create the corresponding PR in the same pass unless the owner explicitly says not to.

## Specialist Roles

### Frontend Agent

- Use skill: `$frontend-planning`
- Focus:
- React SPA structure
- TypeScript, Vite, Router, Query, and UI state conventions
- style systems that stay easy to theme, restyle, and customize later
- route and page planning
- Kanban, Gantt, notifications, and task UX
- error/loading/conflict states
- translating stories into frontend-ready slices

### Frontend Implementer

- Use skill: `$frontend-implementation`
- Focus:
- implementing React, TypeScript, routing, query hooks, forms, and feature UI
- keeping styling tokens, component variants, and layout rules easy to change later
- keeping frontend code aligned with `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- adding frontend tests with the implementation slice

### Backend Agent

- Use skill: `$backend-planning`
- Focus:
- Django modular-monolith boundaries
- Python, Django, DRF, Channels, PostgreSQL, and Redis conventions
- data model, API, authorization, workflow, and concurrency rules
- transactions, invariants, audit logging, and notifications
- translating stories into backend-ready slices

### Backend Implementer

- Use skill: `$backend-implementation`
- Focus:
- implementing Django modules, services, policies, APIs, and tests
- keeping backend code aligned with `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- enforcing invariants and concurrency rules in code

### Reviewer Agent

- Use skill: `$review-planning`
- Focus:
- gaps, duplication, drift, weak acceptance criteria, and sequencing errors
- dependency mistakes and missing cross-cutting work
- operational and security blind spots
- backlog quality before implementation starts

### Fullstack Implementer

- Use skill: `$fullstack-implementation`
- Focus:
- stories that cross backend and frontend boundaries
- API contract sequencing
- integrated delivery slices and cross-layer tests

### QA Tester

- Use skill: `$qa-testing`
- Focus:
- acceptance-criteria validation
- test coverage gaps
- regression and definition-of-done checks

### Issue Execution Agent

- Use skill: `$github-issue-execution`
- Focus:
- turning story issues into concrete delivery slices
- dependency and parallelization breakdown
- PR-ready definitions of done and handoff structure

## Recommended Execution Order

1. Reviewer checks the relevant spec and backlog area first if the task is ambiguous.
2. Backend and frontend planning read `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` and `docs/architecture/CODING_STANDARDS.md` before splitting the story into implementation slices. Frontend-facing agents also read `docs/architecture/FRONTEND_STYLE_GUIDE.md`.
3. Issue execution refines the story into backend, frontend, and test slices when needed.
4. Backend, frontend, or fullstack implementers execute the approved slice using the implementation skills.
5. QA validates the slice against acceptance criteria and high-risk behaviors.
6. Reviewer performs a final pass on dependencies, testability, and definition of done.

## Local Skill Paths

- `skills/frontend-planning`
- `skills/frontend-implementation`
- `skills/backend-planning`
- `skills/backend-implementation`
- `skills/fullstack-implementation`
- `skills/qa-testing`
- `skills/github-issue-execution`
- `skills/review-planning`
- `skills/context`
