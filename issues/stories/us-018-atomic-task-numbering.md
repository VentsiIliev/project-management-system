# US-018 - Atomic Task Numbering

## Metadata

- Area: 5. Task Management
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Suggested status: `implemented`
- Suggested wave: `Wave 3`
- Depends on: `US-017`
- Parallelization note: Pull this forward only once task creation exists. It shares the same persistence path as `US-069`, so implement and review them together as one invariant slice.

## User Story

**As a** system  
**I want** task numbers to be generated atomically per project  
**So that** duplicate task keys are never created.

## Acceptance Criteria

**Given** two users create tasks in the same project at the same time  
**When** both requests are processed  
**Then** each task receives a unique sequential task number.

## Current Slice Notes

- The current task-create service already owned the correct concurrency boundary for this story.
- The real work for this slice is to prove the invariant with transaction-level tests and keep the service resilient in the local SQLite-backed test environment.
- Do not expand this story into task edit, status-change, assignment, or activity-log behavior.

## Execution Breakdown

### Persistence And Concurrency

- [x] Keep task numbering inside the task domain service.
- [x] Lock the owning project row before reading and incrementing `task_counter`.
- [x] Increment `task_counter` by exactly 1 and persist the new value before creating the task row.
- [x] Derive `task_key` from immutable `project.code` plus the new task number.
- [x] Preserve database uniqueness constraints as the last-line duplicate guard.

### Environment-Safe Service Behavior

- [x] Keep the production-safe transactional logic unchanged in principle.
- [x] Add a narrow retry for transient database lock errors in the local SQLite-backed concurrency test path so the story can be verified reliably without weakening the main invariant.
- [x] Keep the retry local to task creation instead of introducing a broad generic retry abstraction.

### Test Slice

- [x] Add a transaction-level concurrent create test that proves two near-simultaneous task creates in the same project produce sequential numbers.
- [x] Assert both persisted `task_number` values and persisted `task_key` values after the concurrent create completes.
- [x] Assert the owning project's `task_counter` matches the highest created task number after both writes finish.
- [x] Keep regression coverage for normal task creation so the new invariant test is grounded in the existing API contract.

## Implementation Result

- `apps/tasks/domain/services.py` keeps task creation inside a transaction that locks the owning project row, increments `task_counter`, and creates the task with the incremented number and derived key.
- The service now retries a very small number of transient `OperationalError` lock failures so the concurrency invariant can be exercised under SQLite test execution, where write contention surfaces as an immediate lock error instead of normal row-level blocking.
- `backend/tests/integration/test_tasks_api.py` now proves concurrent same-project task creation results in `ATM-1` and `ATM-2` with `task_counter == 2`.

## Definition Of Done

- Concurrent task creation in the same project is covered by an automated transaction-level test.
- The service uses an atomic counter increment path tied to the owning project row.
- Unique sequential task numbers and derived task keys are preserved for same-project creates.
- The local backlog reflects the real delivered scope instead of a broad placeholder breakdown.
