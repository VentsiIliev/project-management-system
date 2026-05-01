---
name: frontend-planning
description: Plan frontend delivery from the repository's product specs and local backlog. Use when Codex needs to turn product requirements, user stories, or issue files into React SPA structure, pages, components, state flows, error states, Kanban/Gantt interactions, or frontend implementation slices for this project-management system.
---

# Frontend Planning

Use this skill to convert the repository's planning artifacts into frontend-ready work.

## Workflow

1. Read the relevant source in this order:
- `docs/planning/project_spec_v4-1.md` for UI behavior and frontend architecture
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` for the concrete frontend stack and folder structure
- `docs/architecture/FRONTEND_STYLE_GUIDE.md` for token, variant, and customization rules
- `docs/planning/project_management_user_stories.md` for acceptance criteria
- `issues/story-index.md` plus the relevant `issues/stories/*.md` file for execution detail
2. Confirm the story's dependencies and wave before proposing UI work.
3. Break the work into:
- routes/pages
- state and data-fetching needs
- major components
- styling tokens, variants, and layout primitives when the story introduces new UI patterns
- interaction rules
- loading, empty, error, and conflict states
- test slices
4. Keep the plan aligned with the backend contract. Flag any API or metadata dependency instead of inventing frontend-only behavior.
5. Prefer small vertical slices over broad UI epics when turning a story into tasks.
6. Plan styling so future visual changes remain cheap: prefer shared tokens, composable variants, and reusable layout primitives over feature-local hardcoded values.

## Frontend Defaults For This Repo

- Treat the app as a React SPA.
- Use TypeScript, Vite, React Router, TanStack Query, Zustand, React Hook Form, Zod, `dnd-kit`, Day.js, and Tailwind CSS unless an explicit exception is approved.
- Preserve the MVP scope from the spec and user stories.
- Keep role visibility in the UI aligned with backend authorization, but never rely on the client alone for enforcement.
- Keep styling customizable. When planning new UI, identify what should become a shared token, reusable variant, or common layout primitive.
- Always include explicit handling for:
- loading
- empty results
- validation errors
- permission denied
- network failure
- optimistic-lock conflict where relevant

## Feature Areas

- Kanban:
Read spec UI behavior before planning drag/drop or blocked-state interactions.
- Gantt:
Plan as read-only unless the story explicitly changes that.
- Notifications:
Separate unread state, list state, and mark-read actions.
- Auth:
Model unauthenticated, authenticated, and forced-reset flows separately.

## Output Shape

When producing a frontend plan, prefer:

1. Scope summary
2. Required pages and components
3. Styling system impact
4. State and API dependencies
5. Edge states and risks
6. Parallelizable implementation tasks

## References

- Read `../../docs/architecture/IMPLEMENTATION_ARCHITECTURE.md` when you need the approved frontend stack or repository layout.
- Read `../../docs/architecture/FRONTEND_STYLE_GUIDE.md` when the story introduces or changes reusable visual patterns.
- Read `references/frontend-planning-checklist.md` when you need a compact planning checklist for this repository.
