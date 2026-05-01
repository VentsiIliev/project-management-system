# Frontend Planning Checklist

## Read First

1. Relevant section in `project_spec_v4-1.md`
2. Matching story in `project_management_user_stories.md`
3. Matching local issue in `issues/stories/`

## Always Decide

1. Which page or route owns the flow
2. Which components are shared versus story-specific
3. Which API responses or metadata are required
4. Which states must be visible to the user
5. Which actions are hidden, disabled, or blocked by role or task state

## Always Include

1. Loading state
2. Empty state
3. Validation error state
4. Permission-denied state
5. Network-failure state
6. Conflict state when concurrency matters

## Planning Heuristics

1. Keep board features separate from list features unless the story requires both.
2. Treat Kanban drag/drop as workflow logic plus UI logic, not just UI polish.
3. Treat Gantt as a reporting view first, not an editing surface.
4. Prefer thin page containers and explicit reusable components.
5. Keep test planning tied to acceptance criteria, not just component count.
