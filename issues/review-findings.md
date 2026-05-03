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

## Execution-Time Conflicts

1. `US-009 Create Project` says “Admin or Project Manager” can create a project, but the approved data model only defines a global Admin and project-scoped memberships. A project-scoped role cannot exist before a project exists, so there is no fully explicit spec path for “first project manager creates a project” without prior membership state. Working implementation for `US-009` uses: Admins may always create projects, and non-admin users may create projects only if they already hold at least one active `PROJECT_MANAGER` membership on another project.

2. `US-013 Delete Project With Confirmation` depends on task, subtask, and activity-log preservation rules in the spec, but those modules are not implemented in the current branch stack yet. The working slice for `US-013` is: implement project and membership soft-delete now, keep the spec confirmation flag, hide deleted projects from normal reads, and defer deeper cascades to the future task and activity-log stories.

3. `US-014 Add Project Member` uses `user_id` in the spec request shape, but the current frontend stack has no user-search or user-list surface yet. The working slice keeps the spec contract and exposes a visible members panel with a direct `user_id` entry field instead of inventing a broader user directory story.

4. `US-016 Remove Project Member` includes removed-member task-label behavior in the acceptance criteria, but task read models are not implemented in the current branch stack yet. The grouped `US-015` and `US-016` slice owns membership role updates, membership soft-delete, and immediate project-access loss, while deferring task-label rendering to the future task-view slices.

5. `US-017 Create Task` depends conceptually on later catalog stories for statuses and priorities, but those data-driven catalogs are separate backlog items (`US-028` and `US-053`). The working slice for `US-017` uses a minimal app-level `TODO` status enum and no priority field yet, while keeping the API and UI scoped to first-task creation plus immediate project-scoped visibility.

6. `US-053 Use Database-Driven Priorities` drifted locally into a non-MVP exclusion, but both `docs/planning/project_spec_v4-1.md` and `docs/planning/project_management_user_stories.md` require database-driven priorities in MVP. The working backlog is corrected to implement `US-053` together with `US-028` as the next task-metadata slice.

## What Was Added

1. A local `issues` folder with one story file per user story.
2. A `story-index.md` file that gives each story a suggested dependency set and delivery wave.
3. A small set of baseline epic issue files for setup work that was missing from the issue backlog.
4. Kanban and dependency guidance documents to turn the spec into an executable backlog.
