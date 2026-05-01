# Current Repo State

## Current State

- The auth and admin-user implementation stack is now landed locally through `US-008`.
- Current stacked branch and PR chain:
  - `us-001-auth-foundation` -> PR `#79`
  - `us-002-forced-first-login-password-reset` -> PR `#80`
  - `us-003-logout` -> PR `#81`
  - `us-004-session-expiration` -> PR `#82`
  - `us-005-create-user` -> PR `#83`
  - `us-006-update-user` -> PR `#84`
  - `us-007-reset-user-password` -> PR `#85`
  - `us-008-deactivate-user` -> PR pending
- Current working branch is `us-008-deactivate-user`.
- GitHub issue states in this stack are `:owner-review` for `#6` through `#12`, with `#13` in implementation.
- The only known unrelated local changes are:
  - modified `.gitignore`

## Next Recommended Step

- Start `US-009 Create Project` from the top of the current stacked branch chain after `US-008` is pushed and opened for review.
- Keep the current stack backend-first until an owned admin UI route surface or project frontend surface is introduced.
- Reuse the existing admin-user API conventions:
  - admin-only permission boundary
  - `AdminUserSerializer` response payload
  - structured `VALIDATION_ERROR` / not-found envelopes
  - password-reset-complete requirement for admin actions
  - deactivation through `PATCH /api/admin/users/{user_id}` instead of a second transport path

## Risks Or Open Questions

- PRs are intentionally stacked. Changes to an earlier base PR can require rechecking downstream branches before continuing.
- The admin user-management surface is still backend-only. Avoid inventing frontend admin routes until a story explicitly owns that slice.
- `US-008` revokes live sessions on deactivation. Do not undo that behavior by moving deactivation back into a passive field update.
- Context notes can drift if agents create rollup notes that overlap with existing per-story handoffs. Prefer updating this file for stack status and using story-specific notes only for story-specific implementation details.

## Relevant Files

- `AGENTS.md`
- `issues/stories/us-005-create-user.md`
- `issues/stories/us-006-update-user.md`
- `issues/stories/us-007-reset-user-password.md`
- `issues/stories/us-008-deactivate-user.md`
- `skills/context/handoffs/2026-05-01-us-005-create-user.md`
- `skills/context/handoffs/2026-05-01-us-006-update-user.md`
- `skills/context/handoffs/2026-05-01-us-007-reset-user-password.md`
- `skills/context/handoffs/2026-05-01-us-008-deactivate-user.md`
