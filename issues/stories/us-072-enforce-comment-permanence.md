# US-072 - Enforce Comment Permanence

## Metadata
- Area: 22. Key Invariant Coverage
- GitHub labels: `user-story`, `mvp`, `area:invariants`
- Status: `implemented`
- Wave: `Wave 4`
- Depends on: `US-033`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Lock in comment permanence as an invariant, not only a UI choice.
- Prevent comment mutation by omitting edit/delete backend paths.

## Acceptance
- Comments cannot be edited or deleted through the supported API surface.

## Delivered
- No mutable comment endpoints
- Integration coverage for unavailable edit paths
- Immutable comment rendering in the task detail timeline
