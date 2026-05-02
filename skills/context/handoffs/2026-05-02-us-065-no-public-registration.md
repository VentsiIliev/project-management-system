# US-065 - No Public Registration

## What Changed

- Made the MVP boundary explicit instead of leaving it implicit in the current auth shell.
- Added backend coverage proving there is no public `/api/register` endpoint.
- Added frontend route fallback behavior so unauthenticated `/register` attempts return to the login flow.
- Added frontend coverage proving the login screen exposes no sign-up or create-account affordance.

## Validation

- Backend: `py -3.12 -m pytest tests/integration/test_auth_api.py tests/integration/test_projects_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `61 passed`
- Frontend: `npm run test:run -- src/features/auth/AuthFlow.test.tsx src/features/projects/ProjectsFlow.test.tsx` -> `19 passed`
