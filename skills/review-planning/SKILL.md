---
name: review-planning
description: Review specification and backlog quality for the repository's planning artifacts. Use when Codex needs to inspect the spec, user stories, issue files, dependency maps, or Kanban structure for gaps, duplication, drift, weak acceptance criteria, missing decisions, sequencing problems, or hidden delivery risks in this project-management system.
---

# Review Planning

Use this skill to perform a planning review before implementation work starts or before a backlog area is expanded.

## Workflow

1. Read the smallest relevant planning set first:
- `docs/planning/project_spec_v4-1.md`
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- matching section in `docs/planning/project_management_user_stories.md`
- matching files under `issues/`
2. Review for:
- conflicts between source documents
- conflicts between the approved implementation contract and the broader spec
- duplicated planning artifacts
- missing acceptance criteria
- hidden cross-cutting work
- dependency mistakes
- stories that are too broad to execute cleanly
3. Prioritize findings by delivery risk, not by wording preference.
4. If a problem affects the execution backlog, point to the exact `issues/` file that should change.
5. Separate real blockers from optional improvements.

## Review Standards For This Repo

- Treat source-of-truth drift as a top-level planning problem.
- Treat missing dependency information as a serious execution problem.
- Treat copy-pasted implementation blocks with suspicion, especially in operations and invariants.
- Prefer findings that affect build order, ownership, risk, or testability.

## Output Shape

When producing a review, prefer:

1. Findings ordered by severity
2. Open questions or assumptions
3. Short summary of recommended backlog changes

If no material findings exist, say that explicitly and note any residual risk.

## References

- Read `references/review-checklist.md` when you need a compact review checklist for this repository.
