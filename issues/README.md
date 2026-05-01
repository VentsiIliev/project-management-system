# Local Issue Backlog

This folder is the working backlog for the project specification.

## Structure

- [review-findings.md](./review-findings.md): problems, duplication, and improvement opportunities found in the current files.
- [kanban-structure.md](./kanban-structure.md): recommended board columns, swimlanes, WIP rules, and execution waves.
- [dependency-map.md](./dependency-map.md): critical paths and parallel delivery tracks.
- [story-index.md](./story-index.md): index of all user-story issues, with suggested waves and dependencies.
- [sync-policy.md](./sync-policy.md): rules for keeping the local backlog and GitHub backlog in sync.
- [github-label-policy.md](./github-label-policy.md): active GitHub workflow labels and future rename map.
- [epics](./epics): cross-cutting setup issues that should exist before most feature stories start.
- [stories](./stories): one local issue file per user story.

## Recommended Source Of Truth

- Product and architecture rules: `docs/planning/project_spec_v4-1.md`
- User intent and acceptance criteria: `docs/planning/project_management_user_stories.md`
- Local execution backlog: this `issues` folder

## GitHub Usage

- Create one GitHub issue per file in `stories`.
- Create one GitHub issue per file in `epics`.
- Use the labels already suggested inside each local issue file.
- Use `story-index.md` as the import/checklist sheet while creating issues.
- Use `kanban-structure.md` for board columns and move rules.
- Use `sync-policy.md` to decide which system is the source of truth for which kind of change.
- Use `github-label-policy.md` to apply the active label workflow consistently.

## Important Note

The existing `docs/legacy/github_issues_structure_tdd.md` and `docs/legacy/tdd_layered_implementation_kanban_tasks.md` are still useful as source material, but they should no longer be treated as the working backlog. They are too repetitive and too easy to let drift.
