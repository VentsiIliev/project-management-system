# Skills Workspace

This folder is the repo-local workspace for agent behavior.

## Layout

- `frontend-planning`, `backend-planning`, `review-planning`: planning and review skills
- `frontend-implementation`, `backend-implementation`, `fullstack-implementation`: delivery skills
- `qa-testing`: validation skill
- `github-issue-execution`: issue-to-execution skill
- `context/`: reusable agent notes, patterns, decisions, and handoff records

## Context Usage

Agents should keep durable context in `skills/context/` when it is likely to help future work:

- patterns that should be reused
- decisions already made
- conventions for where to implement specific behaviors
- known traps, tradeoffs, or rejected approaches
- short handoff notes between planning, implementation, and review

Context files should be concise, dated, and tied to a concrete area of the system.
