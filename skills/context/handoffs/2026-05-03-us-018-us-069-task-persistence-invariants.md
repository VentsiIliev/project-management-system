# US-018 and US-069 Task Persistence Invariants

## Delivered Slice

- Treated `US-018` and `US-069` as one narrow backend-only review slice over the existing task-create persistence path.
- Kept atomic numbering inside `apps/tasks/domain/services.py`:
  - lock the owning `Project` row
  - increment `task_counter`
  - create the task with `{project.code}-{task_number}`
- Added a small retry around transient lock `OperationalError` failures so the concurrency invariant can be exercised under the local SQLite-backed test environment without changing the core locking strategy.
- Proved task ownership and numbering invariants in `backend/tests/integration/test_tasks_api.py`:
  - concurrent same-project creates produce sequential task numbers and keys
  - direct persistence without a project fails
  - normal API-backed create persists the expected `project_id`

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `14 passed`

## Backlog Corrections

- Rewrote `issues/stories/us-018-atomic-task-numbering.md` from a broad placeholder into the actual concurrency-invariant slice.
- Rewrote `issues/stories/us-069-enforce-task-project-ownership.md` from an unrelated dependency-management placeholder into the real single-project ownership slice.
- Recorded the drift in `issues/review-findings.md` so the local backlog remains the working source of truth.
