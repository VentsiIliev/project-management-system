# Agent Workspace Layout

## Context

- This repository now uses multiple repo-local skills for planning, implementation, QA, and issue execution.
- Future agents need one predictable place for reusable context instead of relying on prior chat history.

## Decision

- Keep all repo-local agent assets under `skills/`.
- Keep `AGENTS.md` at the repo root as the entry point.
- Store durable reusable context under `skills/context/`.

## Rationale

- Repo-local skills are easiest to discover and maintain when they stay in one workspace.
- `AGENTS.md` remains easy to find at the repository root.
- Shared context becomes explicit, reviewable, and versioned.

## Consequences

- Positive:
- Agent behavior, references, and reusable notes are co-located.
- Future implementation work can reuse decisions and patterns without digging through issue history.
- Negative:
- Agents must avoid turning `skills/context/` into a second drifting spec. Entries should stay concise and operational.

## Related Files Or Issues

- `AGENTS.md`
- `skills/README.md`
- `skills/context/README.md`
