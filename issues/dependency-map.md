# Dependency Map

Use [story-index.md](./story-index.md) as the full per-story lookup. This file highlights the main execution chains and the best parallel tracks.

## Main Critical Paths

1. Auth and authorization backbone:
`US-001 -> US-055 -> US-056`
2. Project to task backbone:
`US-009 -> US-014 -> US-017 -> US-026`
3. Dependency engine:
`US-017 -> US-030 -> US-029 -> US-031 -> US-027 -> US-047`
4. Collaboration engine:
`US-017 -> US-019 -> US-033 -> US-035 -> US-036`
5. Notification engine:
`US-017 -> US-040 -> US-037 -> US-038 -> US-039`
6. Board and reporting views:
`US-011 -> US-045 -> US-046 -> US-047`
`US-017 -> US-045 -> US-048 -> US-050`
`US-017 -> US-045 -> US-051 -> US-052`

## Best Parallelization Opportunities

1. After `US-001` is stable, split into three streams:
- Auth hardening
- Admin flows
- Project baseline
2. After `US-009` and `US-005` are done, memberships can move in parallel with project read/edit/delete work.
3. After `US-017` lands, split into four streams:
- Task CRUD and visibility
- Workflow/status logic
- Activity logging
- Priorities and metadata
4. After `US-019` and `US-040` land, comments and notifications can be developed in parallel.
5. After `US-045` lands, Kanban, Gantt, and My Tasks can be developed in parallel.
6. Operations stories should not block most feature work. Keep them in a separate stream unless deployment is imminent.

## Dependency Risks To Watch

1. `US-027` depends on both workflow and dependency-state correctness. Starting it too early will cause rework.
2. `US-047` depends on status rules and blocked-state logic, not just board rendering.
3. `US-050` depends on overdue/conflict rules being settled, not just Gantt UI work.
4. `US-062`, `US-063`, and `US-064` currently overlap in the source planning docs more than they should. Keep ownership separate when creating GitHub issues.
5. `US-059` should wait until the optimistic-lock contract is final across both backend and frontend.

## Epic Prerequisites

1. Project setup and architecture
2. Database baseline
3. Backend baseline
4. Frontend baseline
5. Testing baseline

Those epic files live in [epics](./epics) and should be created in GitHub before most story work starts.
