# US-055 Backend Authorization

## Delivered Slice

- Audited the currently implemented protected backend surface across auth-admin, projects, memberships, tasks, and workflow metadata endpoints.
- Hardened `apps/users/api/permissions.py` so:
  - unauthenticated requests stay unauthenticated
  - reset-required sessions are rejected explicitly as password-reset blocked
  - admin-only endpoints distinguish admin-role failures from account-state failures
- Hardened `apps/projects/selectors.py`, `apps/projects/domain/policies.py`, and `apps/tasks/domain/policies.py` so invalid actors do not gain visibility or mutation rights if a future transport layer forgets to apply the normal permission class.
- Added integration coverage proving the implemented endpoint surface rejects:
  - unauthenticated users
  - inactive-session users
  - reset-required users
  while preserving the existing `403` vs `404` project-exposure behavior.

## Validation

- Backend: `C:\Users\vents\AppData\Local\Programs\Python\Python310\python.exe -m pytest backend\tests\integration\test_auth_api.py backend\tests\integration\test_projects_api.py backend\tests\integration\test_tasks_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `111 passed`

## Notes

- This slice did not add new frontend code.
- The current repo behavior treats inactive authenticated sessions as effectively unauthenticated on protected endpoints, and the new tests now lock that behavior in.
- `US-042` remains blocked on `US-040`; `US-055` does not depend on future activity-log modules.
