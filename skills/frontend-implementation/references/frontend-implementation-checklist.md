# Frontend Implementation Checklist

## Before Coding

1. Read the relevant `issues/stories/*.md` file.
2. Read the corresponding behavior in `project_spec_v4-1.md` if the interaction is ambiguous.
3. Confirm the backend contract exists or note the blocker.

## During Coding

1. Put API access in `api/` or feature API wrappers.
2. Put query and mutation composition in hooks.
3. Keep page components orchestration-focused.
4. Handle loading, empty, validation, permission, network, and conflict states.
5. Keep form state explicit.

## High-Risk Areas

1. Auth redirects
2. Kanban drag and drop
3. Optimistic lock conflict handling
4. Notification unread/read flows
5. Gantt conflict warnings

## Before Finishing

1. Re-check the story acceptance criteria.
2. Re-check dependency assumptions.
3. Add or update tests.
4. Confirm the implementation still matches `IMPLEMENTATION_ARCHITECTURE.md`.
