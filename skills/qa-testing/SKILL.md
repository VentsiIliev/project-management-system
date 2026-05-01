---
name: qa-testing
description: Verify implementation slices for this repository against acceptance criteria and architecture rules. Use when Codex needs to design or execute test coverage, validate definition of done, inspect regressions, or prepare release confidence for backend, frontend, or fullstack work in the project-management system.
---

# QA Testing

Use this skill when the main goal is validation rather than planning or primary feature implementation.

## Workflow

1. Read the source in this order:
- `docs/architecture/IMPLEMENTATION_ARCHITECTURE.md`
- `docs/architecture/CODING_STANDARDS.md`
- the relevant issue file under `issues/stories/` or `issues/epics/`
- code or test files touched by the implementation slice
2. Translate acceptance criteria into checks:
- backend unit or integration tests
- frontend component or integration tests
- concurrency or permission checks where relevant
- manual verification notes if automation is not yet possible
3. Review the slice for:
- missing tests
- weak assertions
- regressions in auth, permissions, workflow, numbering, dependencies, and notifications
- unhandled empty, error, and conflict states
4. Run or propose the smallest meaningful test set.
5. Finish with a definition-of-done verdict: pass, blocked, or incomplete.

## Test Standards For This Repo

1. Prefer behavior-focused tests over framework noise.
2. Treat workflow transitions, dependency rules, and optimistic locking as high-risk.
3. Treat hidden permission assumptions as bugs, not polish.
4. Call out shared abstractions that are leaking feature-specific behavior.
5. Call out missing observability or fixture setup if it blocks reliable testing.

## Output Shape

1. Findings ordered by severity
2. Tests run or tests still missing
3. Final confidence statement with blockers if any

## References

- Read `references/qa-testing-checklist.md` for the compact validation checklist.
