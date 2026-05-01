# Review Findings

## Highest-Impact Problems

1. The repository claims a single authoritative spec, but planning is split across `docs/planning/project_spec_v4-1.md`, `docs/planning/project_management_user_stories.md`, `docs/legacy/github_issues_structure_tdd.md`, and `docs/legacy/tdd_layered_implementation_kanban_tasks.md`. That creates guaranteed drift.
2. `docs/legacy/github_issues_structure_tdd.md` is mostly a placeholder document, not a ready backlog. It repeatedly says "copy from ..." instead of containing the final issue body.
3. `docs/legacy/tdd_layered_implementation_kanban_tasks.md` duplicates the same TDD workflow text for every story. The repetition is high enough that story-specific differences are hard to spot.
4. Some implementation blocks appear to be copy-pasted too broadly. `US-063` and `US-064` currently share nearly identical task content even though backup policy and Redis recovery are separate concerns.
5. The Markdown files have encoding corruption such as `â€”` and `â†’`. That will make GitHub issues, docs, and future automation look broken.
6. `README.md` is effectively empty, so a new contributor has no entry point into the spec set.

## Structural Gaps

1. There is no explicit dependency map between stories, even though many stories are sequential by nature.
2. There is no explicit parallelization plan, so a team could easily serialize work that should be split into tracks.
3. Cross-cutting setup work appears only as a tail section in `docs/legacy/tdd_layered_implementation_kanban_tasks.md`. Those baseline epics should be first-class backlog items.
4. Feature stories, constraints, invariants, and operational concerns are all mixed together at the same level. That is valid for traceability, but weak for day-to-day execution.
5. The existing board model has no explicit `Blocked` column. For a dependency-heavy project, that is a process gap.

## Improvement Opportunities

1. Keep `docs/planning/project_spec_v4-1.md` as the architecture and rules source, `docs/planning/project_management_user_stories.md` as the acceptance-criteria source, and this `issues` folder as the execution source.
2. Replace repeated TDD boilerplate with one shared issue template and keep each issue file focused on story-specific tasks, dependencies, and acceptance criteria.
3. Promote setup work into explicit epic issues before feature delivery starts.
4. Separate backlog views by purpose:
   - Feature stories
   - Guardrails and invariants
   - Operations and recovery
   - Foundational epics
5. Fix encoding across the original Markdown files before publishing them to GitHub or reusing them for automation.
6. Expand `README.md` or replace it with a proper project navigation document.

## What Was Added

1. A local `issues` folder with one story file per user story.
2. A `story-index.md` file that gives each story a suggested dependency set and delivery wave.
3. A small set of baseline epic issue files for setup work that was missing from the issue backlog.
4. Kanban and dependency guidance documents to turn the spec into an executable backlog.
