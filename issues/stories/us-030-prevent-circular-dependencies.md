# US-030 - Prevent Circular Dependencies

## Metadata
- Area: 8. Dependencies and Blocking
- GitHub labels: `user-story`, `mvp`, `area:dependencies`
- Status: `implemented`
- Suggested wave: `Wave 4`
- Depends on: US-029
- Parallelization note: Implement inside the same dependency transaction as `US-029` and `US-032`.

## User Story
**As a** system
**I want** to prevent circular dependencies
**So that** the dependency graph stays valid.

### Acceptance Criteria

**Given** adding a dependency would create a cycle
**When** the request is processed
**Then** the system rejects it with `DEPENDENCY_CYCLE`.

**Given** concurrent dependency requests are submitted
**When** one would result in a cycle
**Then** the system rejects the unsafe transaction.

## Execution Breakdown

### Backend
- [ ] Detect cycles before insert inside a transaction that locks the relevant dependency rows.
- [ ] Return a stable `DEPENDENCY_CYCLE` error contract from the dependency-create endpoint.

### Tests
- [ ] Add integration coverage for simple cycles and longer graph cycles.
- [ ] Add concurrency coverage showing one unsafe dependency creation is rejected.

## Definition Of Done
- Circular dependency creation is rejected deterministically.
- The cycle rule remains enforced under concurrent create attempts.
