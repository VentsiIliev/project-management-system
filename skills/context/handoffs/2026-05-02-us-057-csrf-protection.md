# US-057 - CSRF Protection

## What Changed

- Completed the remaining explicit CSRF coverage on the current session-auth stack.
- Added integration tests for logout, forced password reset, admin user creation, and project creation with and without valid CSRF tokens.
- Completed the production cookie settings required by the spec.

## Implementation Notes

- No new CSRF middleware was introduced; the repo continues to rely on Django session-auth CSRF enforcement.
- The shared frontend API client remains the single attachment point for `X-CSRFToken` and `credentials: include`.
- This story did not add new visible UI; it hardens and verifies the existing unsafe-request path.

## Validation

- Backend: `py -3.12 -m pytest tests/integration/test_auth_api.py tests/integration/test_projects_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `56 passed`
- Frontend: `npm run test:run -- src/features/auth/AuthFlow.test.tsx src/features/projects/ProjectsFlow.test.tsx` -> `17 passed`
