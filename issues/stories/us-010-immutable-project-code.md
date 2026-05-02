# US-010 - Immutable Project Code

## Metadata

- Area: 3. Projects
- GitHub labels: `user-story`, `mvp`, `area:projects`
- Suggested status: `Ready`
- Suggested wave: `Wave 2`
- Depends on: `US-009`
- Parallelization note: Deliver this invariant on the same branch as `US-012`, because the PATCH surface is the first meaningful place to enforce it.

## User Story

**As a** system  
**I want** project codes to remain immutable  
**So that** task keys remain stable forever.

## Acceptance Criteria

**Given** a project already exists  
**When** a user attempts to update the project code  
**Then** the system rejects the request with `PROJECT_CODE_IMMUTABLE`.

## Execution Breakdown

### Backend Slice

- [x] Reject any `PATCH /api/projects/{project_id}` request that includes `code`.
- [x] Return a structured `PROJECT_CODE_IMMUTABLE` error without mutating the project.
- [x] Keep other editable fields on the same PATCH route updateable when `code` is absent.

### Frontend Slice

- [x] Do not expose editable project code in the project edit UI.
- [x] Keep the existing project code visible as a stable identifier in the detail workspace.

### Test Slice

- [x] Add backend integration coverage for `code` rejection on the project PATCH route.
- [x] Add frontend coverage showing the edit UI does not offer a mutable project-code field.

## Dependencies And Notes

- This story is satisfied as part of the `US-012` project update slice.
- The invariant matters before task-key generation work, but it does not need a separate route or UI beyond the edit flow.

## Definition Of Done

- Project PATCH requests containing `code` return `PROJECT_CODE_IMMUTABLE`.
- The edit UI does not allow project code changes.
- Successful non-code edits still work through the same update route.
