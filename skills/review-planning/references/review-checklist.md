# Review Checklist

## Source Of Truth

1. Does the backlog duplicate information that should live only in the spec or stories?
2. Is the working backlog in `issues/` aligned with the main spec and story set?
3. Are legacy files being treated as live planning artifacts by mistake?

## Story Quality

1. Is the acceptance criteria specific enough to implement and test?
2. Is the story too broad for one delivery slice?
3. Are role, state, and edge-case rules explicit?

## Dependency Quality

1. Are the story prerequisites named?
2. Is the delivery wave reasonable?
3. Are there hidden shared dependencies across frontend, backend, and operations?

## Implementation Quality

1. Are tasks broken into database, backend, frontend, and tests where relevant?
2. Is there obvious copy-paste drift across stories?
3. Are cross-cutting epics missing?

## Risk Quality

1. Does the story depend on concurrency, audit, or invariant logic?
2. Does the story cross module boundaries without clear ownership?
3. Would starting the story now likely cause rework later?
