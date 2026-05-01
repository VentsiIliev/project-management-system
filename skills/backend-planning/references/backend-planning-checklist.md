# Backend Planning Checklist

## Read First

1. Relevant section in `project_spec_v4-1.md`
2. Matching story in `project_management_user_stories.md`
3. Matching local issue in `issues/stories/`

## Always Decide

1. Which module owns the behavior
2. Which tables or reference data are affected
3. Which endpoint or event contract changes
4. Which permissions apply
5. Which invariants must be enforced server-side
6. Which operations require transactions or concurrency controls

## Always Include

1. Validation rules
2. Permission checks
3. Standard error behavior
4. Soft-delete behavior
5. Audit/activity impact
6. Test coverage shape

## Planning Heuristics

1. Prefer services over fat endpoint handlers.
2. Keep module boundaries stable even when one story touches several entities.
3. Treat dependency logic and workflow logic as high-risk areas for rework.
4. Separate reference-data stories from user-data stories.
5. If a frontend story appears blocked, state the missing backend contract explicitly.
