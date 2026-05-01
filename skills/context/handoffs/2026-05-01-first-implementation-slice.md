# First Implementation Slice

## Current State

- The repository now has a runnable Django and React scaffold.
- Foundational epics still need to be translated into executable slices before broad feature work starts.
- `US-001` is the first real story with no story dependency, but it depends on baseline setup decisions from the project, backend, frontend, and testing epics.

## First Recommended Slice

Implement the auth foundation slice that makes `US-001 User Login` buildable.

That slice should include:

- backend user module scaffold with custom user model and auth-state fields
- backend session or login endpoint contract with structured error envelope
- frontend auth route shell and session state shell
- frontend shared API client foundation
- minimal backend and frontend test scaffolding for auth flow

## Why This Comes First

- It satisfies the earliest executable story dependency chain.
- It covers the most reused foundation for later admin, project, and membership flows.
- It converts the setup epics into real code instead of leaving them as abstract checklist items.

## Boundaries

- Do not implement password reset, logout, or session expiration yet.
- Do not implement admin CRUD yet.
- Do not implement project or task flows yet.

## Suggested Issue Flow

1. Refine Epic `00-project-setup-and-architecture` into an auth-foundation implementation slice.
2. Use `US-001` as the acceptance target.
3. Delegate backend auth model and login endpoint work to backend implementation.
4. Delegate frontend auth shell and login screen work to frontend implementation.
5. Finish with QA focused on the `US-001` acceptance criteria only.

## Relevant Files

- `issues/epics/00-project-setup-and-architecture.md`
- `issues/epics/02-backend-baseline.md`
- `issues/epics/03-frontend-baseline.md`
- `issues/epics/04-testing-baseline.md`
- `issues/stories/us-001-user-login.md`
