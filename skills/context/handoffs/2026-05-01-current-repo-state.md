# Current Repo State

## Current State

- The auth, admin-user, and first project-creation implementation stack is now landed locally through `US-009`.
- Current stacked branch and PR chain:
  - `us-001-auth-foundation` -> PR `#79`
  - `us-002-forced-first-login-password-reset` -> PR `#80`
  - `us-003-logout` -> PR `#81`
  - `us-004-session-expiration` -> PR `#82`
  - `us-005-create-user` -> PR `#83`
  - `us-006-update-user` -> PR `#84`
  - `us-007-reset-user-password` -> PR `#85`
  - `us-008-deactivate-user` -> PR `#86`
  - `us-009-create-project` -> PR pending
- Current working branch is `us-009-create-project`.
- GitHub issue states in this stack are `:owner-review` for `#6` through `#13`, with `#14` in implementation.
- The only known unrelated local changes are:
  - modified `.gitignore`

## Next Recommended Step

- Start `US-010 Immutable Project Code` or `US-011 View Project` from the top of the current stacked branch chain after `US-009` is pushed and opened for review.
- Reuse the new project-create conventions:
  - `POST /api/projects` as the first project-domain API
  - creator becomes `owner` and receives an active `PROJECT_MANAGER` membership
  - project creation permission is Admin or existing active `PROJECT_MANAGER` membership
  - the authenticated shell now lands in a visible project workspace instead of an auth-only placeholder

## Risks Or Open Questions

- PRs are intentionally stacked. Changes to an earlier base PR can require rechecking downstream branches before continuing.
- The admin user-management surface is still backend-only. Avoid inventing frontend admin routes until a story explicitly owns that slice.
- The project frontend surface now exists at the protected-shell index route. Future project stories should build on that route instead of replacing it with another placeholder.
- `US-008` revokes live sessions on deactivation. Do not undo that behavior by moving deactivation back into a passive field update.
- The “Project Manager can create projects” wording remains ambiguous because memberships are project-scoped. The working rule is documented in `issues/review-findings.md` and the `US-009` handoff.
- Context notes can drift if agents create rollup notes that overlap with existing per-story handoffs. Prefer updating this file for stack status and using story-specific notes only for story-specific implementation details.

## Relevant Files

- `AGENTS.md`
- `issues/stories/us-005-create-user.md`
- `issues/stories/us-006-update-user.md`
- `issues/stories/us-007-reset-user-password.md`
- `issues/stories/us-008-deactivate-user.md`
- `issues/stories/us-009-create-project.md`
- `skills/context/handoffs/2026-05-01-us-005-create-user.md`
- `skills/context/handoffs/2026-05-01-us-006-update-user.md`
- `skills/context/handoffs/2026-05-01-us-007-reset-user-password.md`
- `skills/context/handoffs/2026-05-01-us-008-deactivate-user.md`
- `skills/context/handoffs/2026-05-02-us-009-create-project.md`
