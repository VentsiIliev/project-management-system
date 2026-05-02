# Current Repo State

## Current State

- The auth and first project CRUD-read-update stack is now landed locally through `US-012`, with the `US-010` immutable-code invariant delivered on the same branch.
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
  - `us-011-view-project` -> PR `#91`
  - `us-012-edit-project` -> PR pending
- Current working branch is `us-012-edit-project`.
- GitHub issue states in this stack are `:owner-review` for `#6`, `#7`, `#8`, `#9`, `#10`, `#11`, `#12`, `#13`, `#14`, and `#16`, with `US-010` and `US-012` in implementation.
- Known unrelated local changes still present and intentionally untouched:
  - modified `.gitignore`
  - modified `AGENTS.md`
  - modified `issues/sync-policy.md`
  - untracked migration rename files under `backend/apps/memberships/migrations/` and `backend/apps/projects/migrations/`

## Next Recommended Step

- Start `US-013 Delete Project With Confirmation` from the top of the current stacked branch chain now that the project detail route and edit-capable workspace already exist.
- Reuse the current project conventions:
  - `POST /api/projects` for create
  - `GET /api/projects` for the authenticated visible-project list
  - `GET /api/projects/{project_id}` for visible-project detail reads
  - `PATCH /api/projects/{project_id}` for editable project fields only
  - project `code` is immutable on PATCH and must return `PROJECT_CODE_IMMUTABLE`

## Risks Or Open Questions

- PRs are intentionally stacked. Changes to an earlier base PR can require rechecking downstream branches before continuing.
- The admin user-management surface is still backend-only. Avoid inventing frontend admin routes until a story explicitly owns that slice.
- The project frontend surface now spans the protected-shell index route and `/projects/:projectId`, with detail, read-only, and edit states. Future project stories should extend those routes instead of replacing them with another placeholder.
- `US-008` revokes live sessions on deactivation. Do not undo that behavior by moving deactivation back into a passive field update.
- The "Project Manager can create projects" wording remains ambiguous because memberships are project-scoped. The working rule is documented in `issues/review-findings.md` and the `US-009` handoff.
- The current edit response includes a backend-derived `can_edit` capability flag on project detail payloads. If future actions need more than one capability, consider moving to a small `permissions` object rather than adding many top-level booleans.

## Relevant Files

- `issues/stories/us-009-create-project.md`
- `issues/stories/us-010-immutable-project-code.md`
- `issues/stories/us-011-view-project.md`
- `issues/stories/us-012-edit-project.md`
- `skills/context/handoffs/2026-05-02-us-009-create-project.md`
- `skills/context/handoffs/2026-05-02-us-011-view-project.md`
- `skills/context/handoffs/2026-05-02-us-012-edit-project-and-us-010-immutable-project-code.md`
