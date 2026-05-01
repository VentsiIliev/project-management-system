# Repo Cleanup And First Implementation Prompt

## Current State

- The repository root is intentionally minimal. Only `README.md` and `AGENTS.md` remain at the base.
- Documentation is organized under `docs/`:
  - `docs/planning/`
  - `docs/architecture/`
  - `docs/development/`
  - `docs/legacy/`
- The runnable scaffold exists and works in local no-Docker mode:
  - Django backend
  - React/Vite frontend
  - Vite `/api` proxy to backend
  - SQLite local mode
- The local backlog in `issues/` is the detailed planning source of truth.
- GitHub issues are the execution surface.

## Workflow Rules

- Agents may move issues to `in-progress`, `implemented`, and `:owner-review`.
- Only the repository owner should add `done` and `reviewed`.
- Local backlog and GitHub must stay in sync using:
  - `issues/sync-policy.md`
  - `issues/github-label-policy.md`

## First Valid Implementation Slice

The correct first implementation slice is the auth foundation for `US-001 User Login`.

This should include:

- backend user/auth module scaffold
- custom user model with auth-state fields needed by `US-001`
- login or session endpoint contract
- structured auth error envelope
- frontend auth shell
- frontend login screen
- frontend session state shell
- shared frontend API client foundation
- minimal backend and frontend auth test scaffolding

This should not include yet:

- forced password reset
- logout
- session expiration
- admin CRUD
- project management
- task management

## First Implementation Prompt

Use this prompt to start real implementation in the correct order:

```text
Use $github-issue-execution and $fullstack-implementation to start the first valid implementation slice from the dependency chain.

Start from the auth foundation for US-001, not from a later feature. Read:
- docs/planning/project_spec_v4-1.md
- docs/planning/project_management_user_stories.md
- docs/architecture/IMPLEMENTATION_ARCHITECTURE.md
- docs/architecture/CODING_STANDARDS.md
- docs/architecture/FRONTEND_STYLE_GUIDE.md
- issues/epics/00-project-setup-and-architecture.md
- issues/epics/02-backend-baseline.md
- issues/epics/03-frontend-baseline.md
- issues/epics/04-testing-baseline.md
- issues/stories/us-001-user-login.md
- skills/context/handoffs/2026-05-01-first-implementation-slice.md

First use $github-issue-execution to refine the slice into backend, frontend, and test tasks with explicit definition of done and dependency notes.

Then use $fullstack-implementation to implement that slice by delegating:
- backend auth model, login/session endpoint, structured auth errors, and backend tests to the backend implementation skill
- frontend auth shell, login screen, session state shell, shared API client foundation, and frontend tests to the frontend implementation skill
- final validation to $qa-testing

Keep the work limited to the auth foundation required to make US-001 buildable.
Do not implement forced password reset, logout, session expiration, admin CRUD, or project/task flows yet.

When implementation is complete, update the issue state to implemented or :owner-review, but do not mark it done.
```

## Relevant Files

- `README.md`
- `AGENTS.md`
- `docs/README.md`
- `issues/sync-policy.md`
- `issues/github-label-policy.md`
- `skills/context/handoffs/2026-05-01-first-implementation-slice.md`
