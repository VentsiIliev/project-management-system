---
name: frontend-implementation
description: Implement frontend code for this repository's approved architecture and backlog. Use when Codex needs to build or modify React, TypeScript, Vite, routing, feature modules, forms, query hooks, Kanban UI, Gantt UI, notification UI, or frontend tests for a specific story in this project-management system.
---

# Frontend Implementation

Use this skill when the task should result in frontend code, tests, or concrete file changes.

## Workflow

1. Read the source in this order:
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/architecture/CODING_STANDARDS.md`
- `docs/architecture/FRONTEND_STYLE_GUIDE.md`
- the relevant issue file under `issues/stories/` or `issues/epics/`
- `docs/planning/project_spec_v4-1.md` only for rules or UI behavior that affect implementation
2. Confirm the target slice:
- page or route
- feature module
- API dependency
- state shape
- tests that should be added or updated
3. Implement in thin vertical slices:
- API wrapper
- query or mutation hook
- page or component
- form or interaction behavior
- token, variant, or shared style update when the UI introduces a reusable visual pattern
- tests
4. Keep behavior aligned with backend contracts. If a needed endpoint or response shape is missing, stop inventing and document the blocker.
5. Finish by checking loading, empty, validation, permission, network, and conflict states where relevant.

## Implementation Defaults

- Use TypeScript.
- Use Vite-based structure.
- Use React Router for navigation.
- Use TanStack Query for server state.
- Use Zustand only for transient UI state.
- Use React Hook Form for forms.
- Use Zod for non-trivial client validation.
- Use `dnd-kit` for Kanban drag and drop.
- Use Tailwind CSS for styling.

## File Placement

- Put cross-app providers and bootstrapping in `frontend/src/app/`.
- Put feature code in `frontend/src/features/<feature>/`.
- Put shared API helpers in `frontend/src/api/`.
- Put reusable generic UI in `frontend/src/components/`.
- Put feature tests close to the feature or under `frontend/src/test/` based on existing local patterns.

## Implementation Rules

1. Keep pages thin.
2. Keep API calls out of presentational components.
3. Keep query and mutation composition in hooks.
4. Keep product-specific workflow behavior in `features/` rather than pushing it into `components/` or `lib/`.
5. Promote code to `components/` or `lib/` only when the contract is stable enough for reuse across multiple features in this product family.
6. Keep styles easy to change by preferring shared tokens, reusable variants, and centralized visual primitives over hardcoded feature-local values.
7. When adding new visual patterns, decide explicitly whether they belong in a shared style layer, a reusable component variant, or only in the owning feature.
8. Do not let optimistic UI behavior bypass server truth for workflow-sensitive actions.
9. Treat Kanban moves as workflow mutations, not local-only state shuffles.
10. Treat Gantt as read-only in MVP.

## Required Checks

1. Route guards match auth and reset-password flows.
2. Action visibility matches role expectations from the spec.
3. Error states are explicit and not collapsed into one generic banner.
4. New styling does not trap colors, spacing, typography, or variants inside one-off feature code when they are likely to be reused or restyled later.
5. Story acceptance criteria are covered by component, integration, or E2E tests where appropriate.

## References

- Read `../../docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` for the approved stack and folder layout.
- Read `../../docs/architecture/CODING_STANDARDS.md` for the shared coding and reuse rules.
- Read `../../docs/architecture/FRONTEND_STYLE_GUIDE.md` for styling token, variant, and customization rules.
- Read `references/frontend-implementation-checklist.md` for a compact execution checklist.
