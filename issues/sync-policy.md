# Backlog Sync Policy

This repository uses both a local backlog and a GitHub backlog. They must not drift.

## Source Of Truth Split

Use the local `issues/` folder as the detailed planning source of truth for:

- full story breakdown
- dependency reasoning
- implementation task decomposition
- definition of done details
- planning notes and corrections

Use GitHub issues as the execution surface for:

- current status
- assignee or owner
- implementation progress
- owner review state
- execution comments and review trail

Use `github-label-policy.md` for the active label names in the repository.

## Completion States

- `Implemented`: agent work is complete and ready for your review
- `Owner Review`: waiting for your explicit review
- `Done`: you reviewed and accepted the issue

Only the repository owner should mark an issue `Done` or add the review label.

## Sync Rules

1. Do not let GitHub issue bodies become a second evolving spec.
2. If acceptance criteria, dependency rules, or task breakdown change, update the local issue file first.
3. If execution state changes, update GitHub first.
4. When a local issue file changes in a way that affects execution, reflect the important change in the GitHub issue with a short comment or body update.
5. When an agent finishes implementation, move the GitHub issue to `implemented` or `:owner-review`, but do not mark it `done`.
6. When you finish review and accept the work, move the GitHub issue to `done` and add `reviewed`.
7. If a GitHub issue diverges from the local file, correct the local file and then resync GitHub.

## Recommended Operating Pattern

1. Refine the local issue file.
2. Implement against the local file.
3. Use GitHub to reflect progress and review state.
4. Record durable reusable decisions in `skills/context/` when needed.

## When To Update Both

Update both local and GitHub when:

- the issue scope changes
- a dependency changes
- a story is split
- a blocker changes execution order
- the completion or review state changes

## Review Discipline

- Agent-complete is not owner-approved.
- `Done` must mean owner-reviewed and accepted.
- If an issue is implemented but not yet reviewed by you, it should remain visible in `Implemented` or `Owner Review`.
