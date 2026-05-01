# Kanban Structure

## Board Columns

1. Backlog
2. Ready
3. In Progress
4. Red
5. Green
6. Refactor
7. Implemented
8. Owner Review
9. Blocked
10. Done

## Column Rules

1. `Backlog`: story exists but is not refined enough to start.
2. `Ready`: dependencies are satisfied and acceptance criteria are clear enough to write tests first.
3. `In Progress`: active implementation work has started and the current owner is executing the slice.
4. `Red`: failing tests are written and committed locally.
5. `Green`: the minimum implementation passes the new tests.
6. `Refactor`: cleanup work is happening while tests remain green.
7. `Implemented`: the agent completed implementation and believes the issue is ready for human review.
8. `Owner Review`: the issue is waiting for explicit repository-owner review and acceptance.
9. `Blocked`: active work cannot proceed because of another issue, environment gap, or unresolved spec decision.
10. `Done`: the repository owner reviewed and accepted the issue.

## Ownership Rules

1. Agents may move issues to `In Progress`, `Implemented`, or `Owner Review`.
2. Agents should not mark an issue `Done`.
3. Only the repository owner should move an issue to `Done`.
4. `Implemented` means "agent-complete."
5. `Done` means "owner-reviewed and accepted."

## Swimlanes

1. Foundations
2. Auth and Admin
3. Projects and Memberships
4. Tasks and Workflow
5. Collaboration and Notifications
6. Boards and Reporting
7. Operations and Guardrails

## WIP Guidance

1. Keep at most 2 items per engineer in `Green`.
2. Keep at most 1 item per engineer in `Refactor`.
3. Keep at most 3 items waiting in `Owner Review` without explicit owner action.
4. Do not pull new work into `Green` while a story is stuck in `Owner Review` without an owner decision.
5. Move an item to `Blocked` immediately when it cannot progress for more than one working session.

## Delivery Waves

### Wave 0

- Purpose: create the minimum usable backbone.
- Stories: `US-001`, `US-005`, `US-009`, `US-017`, `US-028`, `US-053`, `US-055`
- Parallel tracks:
- Auth baseline: `US-001`, `US-055`
- Admin baseline: `US-005`
- Project baseline: `US-009`
- Task baseline: `US-017`, `US-028`, `US-053`

### Wave 1

- Purpose: finish auth and admin safety features.
- Stories: `US-002`, `US-003`, `US-004`, `US-006`, `US-007`, `US-008`, `US-057`, `US-058`, `US-065`
- Parallel tracks:
- Auth flows: `US-002`, `US-003`, `US-004`
- Admin actions: `US-006`, `US-007`, `US-008`
- Security hardening: `US-057`, `US-058`, `US-065`

### Wave 2

- Purpose: make project space usable.
- Stories: `US-010`, `US-011`, `US-012`, `US-013`, `US-014`, `US-015`, `US-016`, `US-042`
- Parallel tracks:
- Project CRUD: `US-010`, `US-011`, `US-012`, `US-013`
- Memberships: `US-014`, `US-015`, `US-016`
- Project activity view: `US-042`

### Wave 3

- Purpose: complete the task lifecycle.
- Stories: `US-018`, `US-019`, `US-020`, `US-021`, `US-022`, `US-023`, `US-024`, `US-025`, `US-026`, `US-069`, `US-070`, `US-071`
- Parallel tracks:
- Task CRUD and visibility: `US-018`, `US-019`, `US-020`, `US-021`, `US-022`
- Subtasks: `US-023`, `US-024`, `US-025`
- Workflow and invariants: `US-026`, `US-069`, `US-070`, `US-071`

### Wave 4

- Purpose: collaboration, dependency logic, and notifications.
- Stories: `US-029`, `US-030`, `US-031`, `US-032`, `US-033`, `US-034`, `US-035`, `US-036`, `US-037`, `US-038`, `US-039`, `US-040`, `US-041`, `US-068`, `US-072`
- Parallel tracks:
- Dependency engine: `US-029`, `US-030`, `US-031`, `US-032`, `US-068`
- Comments and realtime: `US-033`, `US-034`, `US-035`, `US-036`, `US-072`
- Activity and notifications: `US-037`, `US-038`, `US-039`, `US-040`, `US-041`

### Wave 5

- Purpose: boards, lists, search, and UX hardening.
- Stories: `US-043`, `US-044`, `US-045`, `US-046`, `US-047`, `US-048`, `US-049`, `US-050`, `US-051`, `US-052`, `US-054`, `US-059`, `US-060`, `US-061`, `US-062`
- Parallel tracks:
- Search and list infrastructure: `US-043`, `US-044`, `US-045`
- Board and timeline views: `US-046`, `US-047`, `US-048`, `US-049`, `US-050`
- Personal views and metadata: `US-051`, `US-052`, `US-054`
- UX and lifecycle hardening: `US-059`, `US-060`, `US-061`, `US-062`

### Wave 6

- Purpose: operational readiness and MVP guardrails.
- Stories: `US-056`, `US-063`, `US-064`, `US-066`, `US-067`
- Parallel tracks:
- Ops and recovery: `US-063`, `US-064`
- Guardrails and non-goals: `US-056`, `US-066`, `US-067`

## Recommended GitHub Labels

Active workflow labels in the repository are documented in `github-label-policy.md`.

General labels:

1. `user-story`
2. `epic`
3. `mvp`
4. `blocked`
5. `area:*`
6. `wave:*`
7. `type:feature`
8. `type:constraint`
9. `type:ops`
