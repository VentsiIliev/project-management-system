# Current Repo State

## Current State

- The auth, project CRUD, and first full membership-management stack is now landed locally through `US-016`, with the `US-010` immutable-code invariant delivered alongside the edit slice.
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
  - `us-012-edit-project` -> PR `#92`
  - `us-013-delete-project` -> PR `#93`
  - `us-014-add-project-member` -> PR `#94`
  - `us-015-016-membership-management` -> PR pending
- Current working branch is `us-015-016-membership-management`.
- GitHub issue states in this stack are `:owner-review` for `#6`, `#7`, `#8`, `#9`, `#10`, `#11`, `#12`, `#13`, `#14`, `#15`, `#16`, `#17`, `#18`, and `#19`, with grouped `US-015` and `US-016` implemented locally and waiting for issue sync.
- Known unrelated local changes still present and intentionally untouched:
  - modified `.gitignore`
  - modified `AGENTS.md`
  - modified `issues/sync-policy.md`
  - modified skill files under `skills/`
  - untracked migration rename files under `backend/apps/memberships/migrations/` and `backend/apps/projects/migrations/`

## Next Recommended Step

- Wave 2 is effectively complete for the currently implemented local dependency chain.
- `US-042 View Project Activity` is the only remaining Wave 2 leftover in the story index, but it still depends on `US-040 Record Task Activity`, which is not implemented in the current branch stack.
- Reuse the current project conventions:
  - `POST /api/projects` for create
  - `GET /api/projects` for the authenticated visible-project list
  - `GET /api/projects/{project_id}` for visible-project detail reads
  - `PATCH /api/projects/{project_id}` for editable project fields only
  - `DELETE /api/projects/{project_id}` with `confirm_project_delete: true`
  - `GET /api/projects/{project_id}/members` for the active membership list
  - `POST /api/projects/{project_id}/members` for add-member with `user_id` and `role`
  - `PATCH /api/projects/{project_id}/members/{user_id}` for role changes
  - `DELETE /api/projects/{project_id}/members/{user_id}` for membership soft-delete
  - project `code` is immutable on PATCH and must return `PROJECT_CODE_IMMUTABLE`

## Risks Or Open Questions

- PRs are intentionally stacked. Changes to an earlier base PR can require rechecking downstream branches before continuing.
- The admin user-management surface is still backend-only. Avoid inventing frontend admin routes until a story explicitly owns that slice.
- The project frontend surface now spans the protected-shell index route and `/projects/:projectId`, with detail, read-only, and edit states. Future project stories should extend those routes instead of replacing them with another placeholder.
- `US-008` revokes live sessions on deactivation. Do not undo that behavior by moving deactivation back into a passive field update.
- The "Project Manager can create projects" wording remains ambiguous because memberships are project-scoped. The working rule is documented in `issues/review-findings.md` and the `US-009` handoff.
- The current edit response includes a backend-derived `can_edit` capability flag on project detail payloads. If future actions need more than one capability, consider moving to a small `permissions` object rather than adding many top-level booleans.
- The current project detail response now includes `can_edit`, `can_delete`, and `can_manage_members`. Future membership stories can keep using those for the existing workspace until a richer permissions object becomes worth introducing.
- The current add-member UI uses the spec `user_id` request shape directly because there is still no user-search or user-list surface in the branch stack.
- The membership-management slice returns `PROJECT_MEMBER_NOT_FOUND` when a target active membership does not exist, and removed-member task labeling is still intentionally deferred until task read models exist.

## Relevant Files

- `issues/stories/us-009-create-project.md`
- `issues/stories/us-010-immutable-project-code.md`
- `issues/stories/us-011-view-project.md`
 - `issues/stories/us-012-edit-project.md`
 - `issues/stories/us-013-delete-project-with-confirmation.md`
 - `issues/stories/us-014-add-project-member.md`
 - `issues/stories/us-015-change-project-member-role.md`
 - `issues/stories/us-016-remove-project-member.md`
 - `skills/context/handoffs/2026-05-02-us-009-create-project.md`
 - `skills/context/handoffs/2026-05-02-us-011-view-project.md`
 - `skills/context/handoffs/2026-05-02-us-012-edit-project-and-us-010-immutable-project-code.md`
 - `skills/context/handoffs/2026-05-02-us-013-delete-project.md`
 - `skills/context/handoffs/2026-05-02-us-014-add-project-member.md`
 - `skills/context/handoffs/2026-05-02-us-015-us-016-membership-management.md`
