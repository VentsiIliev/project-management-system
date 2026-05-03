# US-034 - Immutable Comments

## Metadata
- Area: 9. Comments and Real-Time Updates
- GitHub labels: `user-story`, `mvp`, `area:comments`
- Status: `implemented`
- Wave: `Wave 4`
- Depends on: `US-033`
- Grouped slice: `US-033` + `US-034` + `US-035` + `US-036` + `US-037` + `US-038` + `US-039` + `US-066` + `US-067` + `US-072`

## Scope
- Keep comments permanent after creation.
- Do not expose comment edit or delete APIs or frontend actions.

## Acceptance
- Created comments remain visible as originally written.
- Edit and delete flows are unavailable in MVP.

## Delivered
- Comment model only stores creation-time content
- No comment edit or delete routes in the API surface
- Task detail renders comments as immutable timeline entries
