# US-029 - Add Dependency

## Metadata
- Area: 8. Dependencies and Blocking
- GitHub labels: `user-story`, `mvp`, `area:dependencies`
- Status: `implemented`
- Suggested wave: `Wave 4`
- Depends on: US-017, US-069
- Parallelization note: Implement together with `US-030`, `US-032`, `US-068`, `US-031`, and `US-027` because they all share the same dependency model, task serializer fields, and status-change rules.

## User Story
**As an** Admin or Project Manager
**I want** to add dependencies between tasks
**So that** blocked work is tracked.

### Acceptance Criteria

**Given** I have permission to manage dependencies
**When** I add a dependency between two tasks in the same project
**Then** the system records the dependency.

**Given** the tasks belong to different projects
**When** I add the dependency
**Then** the system rejects the request with `CROSS_PROJECT_DEPENDENCY`.

**Given** the dependency already exists
**When** I add the same dependency again
**Then** the system rejects the request with `DUPLICATE_DEPENDENCY`.

**Given** the dependency points a task to itself
**When** I submit the request
**Then** the system rejects it.

## Execution Breakdown

### Backend
- [ ] Add the task dependency persistence model with uniqueness and no-self guards.
- [ ] Expose task-scoped dependency list, add, and remove endpoints on the existing task API surface.
- [ ] Restrict dependency management to Admins and active Project Managers.

### Frontend
- [ ] Show current dependencies in task detail.
- [ ] Add dependency management controls in the existing workspace task detail panel for eligible users only.
- [ ] Render structured add/remove errors in place.

### Tests
- [ ] Add integration coverage for happy-path dependency creation.
- [ ] Add integration coverage for permission, self-reference, duplicate, and same-project validation.
- [ ] Add frontend coverage for adding and listing dependencies from task detail.

## Definition Of Done
- Dependencies can be added only within the same active project.
- The task detail contract returns dependency data consistently on both list and detail reads.
- Team Members can view dependency state but cannot manage it.
