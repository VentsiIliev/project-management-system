---
name: fullstack-implementation
description: Implement cross-cutting vertical slices for this repository's approved architecture and backlog. Use when Codex needs to deliver a story that spans both Django backend and React frontend, including contracts, integration sequencing, and tests for the project-management system.
---

# Fullstack Implementation

Use this skill when a story cannot be implemented cleanly as a frontend-only or backend-only change.

## Workflow

1. Read the source in this order:
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/architecture/CODING_STANDARDS.md`
- `docs/architecture/FRONTEND_STYLE_GUIDE.md` when the slice includes frontend UI work
- the relevant issue file under `issues/stories/` or `issues/epics/`
- `docs/planning/project_spec_v4-1.md` only for behavior, invariants, or API details that affect implementation
2. Identify the slice boundary:
- backend owner module
- frontend owner feature
- API contract or event contract
- tests needed across layers
3. Implement in dependency order:
- backend model or domain rules
- API or WebSocket contract
- frontend integration
- cross-layer tests and acceptance checks
4. Keep contracts explicit. If a response shape, state machine, or invariant is unclear, record the blocker instead of inventing hidden behavior.
5. Finish with an integration sanity pass against the story acceptance criteria.

## Coordination Rules

1. Backend remains the source of truth for workflow, permissions, numbering, and dependencies.
2. Frontend should reflect backend truth and not encode duplicate workflow logic.
3. Keep shared code at the lowest stable level of abstraction across both layers.
4. Do not merge unrelated backend and frontend changes into one slice just because they touch the same story.
5. Split follow-up issues when one story hides a second operational concern.

## Required Checks

1. Backend errors map to actionable frontend states.
2. Permission-sensitive actions are enforced server-side and represented client-side.
3. Loading, empty, validation, and conflict states exist where the slice needs them.
4. Acceptance criteria are covered across unit, integration, and UI boundaries where appropriate.

## References

- Read `../../docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` for the approved stack and structure.
- Read `../../docs/architecture/CODING_STANDARDS.md` for the shared coding and reuse rules.
- Read `../../docs/architecture/FRONTEND_STYLE_GUIDE.md` when frontend styling or reusable UI patterns are affected.
- Read `references/fullstack-implementation-checklist.md` for the repo-specific execution checklist.
