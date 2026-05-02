# Current Repo State

## Current State

- The auth, admin-user, and first project read stack is now landed locally through `US-011`.
- Current stacked branch and PR chain:
  - `us-001-auth-foundation` -> PR `#79`
  - `us-002-forced-first-login-password-reset` -> PR `#80`
  - `us-003-logout` -> PR `#81`
  - `us-004-session-expiration` -> PR `#82`
  - `us-005-create-user` -> PR `#83`
  - `us-006-update-user` -> PR `#84`
  - `us-007-reset-user-password` -> PR `#85`
  - `us-008-deactivate-user` -> PR `#86`
  - `us-009-create-project` -> PR `#87`
  - `us-011-view-project` -> PR pending
- Current working branch is `us-011-view-project`.
- GitHub issue states in this stack are `:owner-review` for `#6` through `#14`, with `US-011` in implementation.
- Known unrelated local changes still present and intentionally untouched:
  - modified `.gitignore`
  - modified `AGENTS.md`
  - modified `issues/sync-policy.md`
  - untracked migration rename files under `backend/apps/memberships/migrations/` and `backend/apps/projects/migrations/`

## Next Recommended Step

- Start `US-012 Edit Project` from the top of the current stacked branch chain now that a real project detail route exists.
- `US-010 Immutable Project Code` can be delivered with or immediately before the update-path work because there is now a meaningful read surface and route contract for project details.
- Reuse the current project conventions:
  - `POST /api/projects` for create
  - `GET /api/projects` for the authenticated visible-project list
  - `GET /api/projects/{project_id}` for visible-project detail reads
  - Admin sees all active projects; members see only active memberships

## Risks Or Open Questions

- PRs are intentionally stacked. Changes to an earlier base PR can require rechecking downstream branches before continuing.
- The admin user-management surface is still backend-only. Avoid inventing frontend admin routes until a story explicitly owns that slice.
- The project frontend surface now spans the protected-shell index route and `/projects/:projectId`. Future project stories should extend those routes instead of replacing them with another placeholder.
- `US-008` revokes live sessions on deactivation. Do not undo that behavior by moving deactivation back into a passive field update.
- The "Project Manager can create projects" wording remains ambiguous because memberships are project-scoped. The working rule is documented in `issues/review-findings.md` and the `US-009` handoff.
- `US-010` is best treated as an update-path invariant rather than a standalone pre-read story, even though the planning order lists it before `US-011`.

## Relevant Files

- `issues/stories/us-009-create-project.md`
- `issues/stories/us-011-view-project.md`
- `skills/context/handoffs/2026-05-02-us-009-create-project.md`
- `skills/context/handoffs/2026-05-02-us-011-view-project.md`
