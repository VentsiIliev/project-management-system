# US-058 - Rate-Limit Authentication Endpoints

## What Changed

- Added cache-backed authentication failure counters in the `users` domain service layer.
- Repeated failed login attempts are now rate-limited by both client IP and normalized email.
- Repeated failed forced-reset attempts are also rate-limited on the implemented endpoint surface.
- The login form now renders the backend `RATE_LIMITED` error state explicitly.

## Implementation Notes

- The current implementation uses the Django cache backend with configurable settings:
  - `AUTH_RATE_LIMIT_MAX_ATTEMPTS`
  - `AUTH_RATE_LIMIT_WINDOW_SECONDS`
- Structured `429` responses use:
  - error code `RATE_LIMITED`
  - `details.retry_after`
  - `Retry-After` response header
- Successful login clears the accumulated rate-limit counters for the matching IP and normalized email.

## Validation

- Backend: `py -3.12 -m pytest tests/integration/test_auth_api.py tests/integration/test_projects_api.py` with `PYTHONPATH=D:\GitHub\project-management-system\backend\.venv\Lib\site-packages` -> `60 passed`
- Frontend: `npm run test:run -- src/features/auth/AuthFlow.test.tsx src/features/projects/ProjectsFlow.test.tsx` -> `18 passed`
