---
name: github-issue-execution
description: Turn this repository's backlog issues into actionable execution slices and working updates. Use when Codex needs to refine a GitHub issue into implementation tasks, dependency notes, definition of done, PR-ready checklists, or execution handoff context for the project-management system.
---

# GitHub Issue Execution

Use this skill when the issue exists but still needs execution structure before or during delivery.

## Workflow

1. Read the source in this order:
- the relevant file under `issues/stories/` or `issues/epics/`
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/architecture/CODING_STANDARDS.md`
- `issues/sync-policy.md`
- `issues/github-label-policy.md`
- the matching GitHub issue content if available
2. Convert the issue into execution shape:
- backend slice
- frontend slice
- test slice
- dependency or sequencing notes
- definition of done
 - reuse boundary notes when shared code may be justified
3. Keep tasks small enough for one focused implementation pass where possible.
4. Separate blockers, prerequisites, and optional follow-ups.
5. Record reusable decisions or patterns in `skills/context/` when they will matter again.

## Standards For This Repo

1. Do not let GitHub issue text become a second drifting source of truth.
2. Reference the local `issues/` file for detailed planning whenever possible.
3. Make dependencies explicit and directional.
4. Highlight parallelization opportunities only when the contract boundary is clear.
5. Respect the split between agent-complete and owner-reviewed completion states.

## Output Shape

1. Execution breakdown
2. Dependencies and parallel work
3. Definition of done
4. Open blockers or unknowns

## References

- Read `references/github-issue-execution-checklist.md` for the compact execution checklist.
