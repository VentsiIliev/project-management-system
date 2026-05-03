# US-068 - No Cross-Project Dependencies

## Metadata
- Area: 21. MVP Boundary Stories
- GitHub labels: `user-story`, `mvp`, `area:mvp-boundary`
- Status: `:owner-review`
- Suggested wave: `Wave 4`
- Depends on: US-029
- Parallelization note: Implement as part of the base dependency validation path, not as a separate slice.

## User Story
**As a** system
**I want** dependencies limited to the same project
**So that** dependency management stays predictable.

### Acceptance Criteria

**Given** tasks are in different projects
**When** a user attempts to create a dependency between them
**Then** the system rejects the dependency.

## Execution Breakdown

### Backend
- [ ] Validate same-project ownership before dependency creation.
- [ ] Reuse the `CROSS_PROJECT_DEPENDENCY` contract owned by `US-029`.

### Tests
- [ ] Keep explicit integration coverage for cross-project rejection in the grouped dependency slice.

## Definition Of Done
- Cross-project dependency requests are rejected consistently and cannot bypass visibility checks.
