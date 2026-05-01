# GitHub Issues Structure â€” TDD User Story Backlog

> Legacy planning artifact.
>
> Use the local [issues](./issues) folder as the working backlog. This file is retained only as source material that was consolidated into the per-story issue files under `issues/stories`.


Source inputs:
- `project_spec_v4-1.md`
- `project_management_user_stories.md`
- `tdd_layered_implementation_kanban_tasks.md`

Use this file to create one GitHub Issue per user story. Each issue should be linked to the GitHub Project board and moved through the TDD columns below.

## GitHub Project Columns

1. Backlog
2. Ready
3. Red â€” Tests Written / Failing
4. Green â€” Minimal Implementation Passing
5. Refactor
6. Review / QA
7. Done

## Standard Issue Template

```md
## User Story
As a ...
I want ...
So that ...

## Acceptance Criteria
Copy the Given/When/Then criteria from `project_management_user_stories.md`.

## TDD Workflow
- [ ] Convert every Given/When/Then criterion into automated tests.
- [ ] Write failing tests first.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest change needed to pass.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for any bug found during review.

## Layered Tasks
### Database
- [ ] Add or update schema/models/migrations if required.
- [ ] Add model constraints and indexes if required.
- [ ] Add seed data if required.

### Backend/API
- [ ] Implement service/domain logic.
- [ ] Implement REST endpoint or WebSocket behavior.
- [ ] Enforce permissions server-side.
- [ ] Return standard structured errors.

### Frontend/UI
- [ ] Implement page/component/form/state behavior if required.
- [ ] Handle loading, empty, validation, permission, and network states.
- [ ] Connect to API client using CSRF/session handling where required.

### Tests
- [ ] Unit tests.
- [ ] Integration/API tests.
- [ ] Frontend/component tests if applicable.
- [ ] E2E test if this is a critical user flow.

## Definition of Done
- [ ] All tests pass.
- [ ] Acceptance criteria are covered by tests.
- [ ] Permissions and edge cases are covered.
- [ ] Code reviewed.
- [ ] Documentation updated if needed.
```

---

# Issues

## Issue: [US-001] ” User Login

**GitHub title:** `[US-001] ” User Login`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-001` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-001` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-001.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-001.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-001 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-002] ” Forced First-Login Password Reset

**GitHub title:** `[US-002] ” Forced First-Login Password Reset`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-002` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-002` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-002.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-002.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-002 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-003] ” Logout

**GitHub title:** `[US-003] ” Logout`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-003` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-003` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-003.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-003.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-003 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-004] ” Session Expiration

**GitHub title:** `[US-004] ” Session Expiration`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-004` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-004` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-004.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-004.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-004 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-005] ” Create User

**GitHub title:** `[US-005] ” Create User`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-005` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-005` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-005.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-005.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-005 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-006] ” Update User

**GitHub title:** `[US-006] ” Update User`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-006` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-006` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-006.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-006.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-006 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-007] ” Reset User Password

**GitHub title:** `[US-007] ” Reset User Password`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-007` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-007` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-007.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-007.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-007 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-008] ” Deactivate User

**GitHub title:** `[US-008] ” Deactivate User`  
**Labels:** `user-story,tdd,area:auth,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-008` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-008` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-008.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-008.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-008 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-009] ” Create Project

**GitHub title:** `[US-009] ” Create Project`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-009` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-009` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-009.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-009.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-009 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-010] ” Immutable Project Code

**GitHub title:** `[US-010] ” Immutable Project Code`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-010` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-010` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-010.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-010.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-010 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-011] ” View Project

**GitHub title:** `[US-011] ” View Project`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-011` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-011` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-011.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-011.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-011 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-012] ” Edit Project

**GitHub title:** `[US-012] ” Edit Project`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-012` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-012` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-012.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-012.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-012 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-013] ” Delete Project With Confirmation

**GitHub title:** `[US-013] ” Delete Project With Confirmation`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-013` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-013` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-013.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-013.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-013 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-014] ” Add Project Member

**GitHub title:** `[US-014] ” Add Project Member`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-014` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-014` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-014.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-014.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-014 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-015] ” Change Project Member Role

**GitHub title:** `[US-015] ” Change Project Member Role`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-015` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-015` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-015.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-015.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-015 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-016] ” Remove Project Member

**GitHub title:** `[US-016] ” Remove Project Member`  
**Labels:** `user-story,tdd,area:projects,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-016` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-016` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-016.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-016.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-016 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-017] ” Create Task

**GitHub title:** `[US-017] ” Create Task`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-017` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-017` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-017.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-017.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-017 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-018] ” Atomic Task Numbering

**GitHub title:** `[US-018] ” Atomic Task Numbering`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-018` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-018` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-018.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-018.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-018 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-019] ” View Task

**GitHub title:** `[US-019] ” View Task`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-019` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-019` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-019.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-019.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-019 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-020] ” Update Task Planning Fields

**GitHub title:** `[US-020] ” Update Task Planning Fields`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-020` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-020` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-020.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-020.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-020 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-021] ” Team Member Updates Task Description

**GitHub title:** `[US-021] ” Team Member Updates Task Description`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-021` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-021` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-021.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-021.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-021 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-022] ” Delete Task

**GitHub title:** `[US-022] ” Delete Task`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-022` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-022` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-022.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-022.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-022 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-023] ” Create Subtask

**GitHub title:** `[US-023] ” Create Subtask`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-023` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-023` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-023.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-023.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-023 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-024] ” Parent Completion Requires Completed Subtasks

**GitHub title:** `[US-024] ” Parent Completion Requires Completed Subtasks`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-024` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-024` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-024.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-024.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-024 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-025] ” Reopen Parent When Subtask Reopens

**GitHub title:** `[US-025] ” Reopen Parent When Subtask Reopens`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-025` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-025` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-025.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-025.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-025 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-026] ” Change Task Status

**GitHub title:** `[US-026] ” Change Task Status`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-026` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-026` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-026.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-026.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-026 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-027] ” Prevent Blocked Task Progression

**GitHub title:** `[US-027] ” Prevent Blocked Task Progression`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-027` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-027` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-027.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-027.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-027 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-028] ” Database-Driven Statuses

**GitHub title:** `[US-028] ” Database-Driven Statuses`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-028` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-028` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-028.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-028.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-028 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-029] ” Add Dependency

**GitHub title:** `[US-029] ” Add Dependency`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-029` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-029` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-029.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-029.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-029 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-030] ” Prevent Circular Dependencies

**GitHub title:** `[US-030] ” Prevent Circular Dependencies`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-030` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-030` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-030.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-030.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-030 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-031] ” Compute Blocked State

**GitHub title:** `[US-031] ” Compute Blocked State`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-031` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-031` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-031.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-031.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-031 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-032] ” Remove Dependency

**GitHub title:** `[US-032] ” Remove Dependency`  
**Labels:** `user-story,tdd,area:tasks,layer:database,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-032` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-032` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-032.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-032.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-032 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-033] ” Add Comment

**GitHub title:** `[US-033] ” Add Comment`  
**Labels:** `user-story,tdd,area:comments,area:realtime,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-033` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-033` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-033.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-033.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-033 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-034] ” Immutable Comments

**GitHub title:** `[US-034] ” Immutable Comments`  
**Labels:** `user-story,tdd,area:comments,area:realtime,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-034` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-034` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-034.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-034.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-034 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-035] ” Real-Time Comment Broadcast

**GitHub title:** `[US-035] ” Real-Time Comment Broadcast`  
**Labels:** `user-story,tdd,area:comments,area:realtime,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-035` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-035` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-035.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-035.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-035 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-036] ” WebSocket Reconnection

**GitHub title:** `[US-036] ” WebSocket Reconnection`  
**Labels:** `user-story,tdd,area:comments,area:realtime,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-036` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-036` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-036.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-036.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-036 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-037] ” Receive Task Notifications

**GitHub title:** `[US-037] ” Receive Task Notifications`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-037` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-037` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-037.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-037.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-037 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-038] ” View Notifications

**GitHub title:** `[US-038] ” View Notifications`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-038` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-038` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-038.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-038.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-038 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-039] ” Mark Notifications Read

**GitHub title:** `[US-039] ” Mark Notifications Read`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-039` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-039` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-039.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-039.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-039 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-040] ” Record Task Activity

**GitHub title:** `[US-040] ” Record Task Activity`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-040` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-040` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-040.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-040.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-040 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-041] ” View Task Activity

**GitHub title:** `[US-041] ” View Task Activity`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-041` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-041` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-041.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-041.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-041 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-042] ” View Project Activity

**GitHub title:** `[US-042] ” View Project Activity`  
**Labels:** `user-story,tdd,area:notifications-activity,layer:database,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-042` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-042` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-042.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-042.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-042 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-043] ” Search Project Tasks

**GitHub title:** `[US-043] ” Search Project Tasks`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-043` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-043` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-043.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-043.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-043 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-044] ” Filter Project Tasks

**GitHub title:** `[US-044] ” Filter Project Tasks`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-044` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-044` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-044.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-044.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-044 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-045] ” Paginated Lists

**GitHub title:** `[US-045] ” Paginated Lists`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-045` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-045` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-045.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-045.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-045 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-046] ” View Kanban Board

**GitHub title:** `[US-046] ” View Kanban Board`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-046` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-046` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-046.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-046.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-046 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-047] ” Drag Task Between Kanban Columns

**GitHub title:** `[US-047] ” Drag Task Between Kanban Columns`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-047` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-047` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-047.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-047.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-047 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-048] ” View Gantt Timeline

**GitHub title:** `[US-048] ” View Gantt Timeline`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-048` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-048` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-048.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-048.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-048 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-049] ” Read-Only Gantt Interaction

**GitHub title:** `[US-049] ” Read-Only Gantt Interaction`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-049` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-049` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-049.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-049.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-049 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-050] ” Gantt Conflict Warning

**GitHub title:** `[US-050] ” Gantt Conflict Warning`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-050` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-050` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-050.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-050.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-050 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-051] ” View My Assigned Tasks

**GitHub title:** `[US-051] ” View My Assigned Tasks`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-051` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-051` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-051.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-051.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-051 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-052] ” Sort My Tasks

**GitHub title:** `[US-052] ” Sort My Tasks`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-052` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-052` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-052.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-052.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-052 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-053] ” Use Database-Driven Priorities

**GitHub title:** `[US-053] ” Use Database-Driven Priorities`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-053` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-053` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-053.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-053.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-053 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-054] ” View Workflow Metadata

**GitHub title:** `[US-054] ” View Workflow Metadata`  
**Labels:** `user-story,tdd,area:ui,layer:frontend,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-054` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-054` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-054.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-054.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-054 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-055] ” Enforce Backend Authorization

**GitHub title:** `[US-055] ” Enforce Backend Authorization`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-055` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-055` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-055.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-055.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-055 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-056] ” Admin Override With Invariants

**GitHub title:** `[US-056] ” Admin Override With Invariants`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-056` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-056` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-056.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-056.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-056 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-057] ” CSRF Protection

**GitHub title:** `[US-057] ” CSRF Protection`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-057` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-057` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-057.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-057.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-057 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-058] ” Rate-Limit Authentication Endpoints

**GitHub title:** `[US-058] ” Rate-Limit Authentication Endpoints`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-058` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-058` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-058.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-058.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-058 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-059] ” Handle Optimistic Lock Conflict

**GitHub title:** `[US-059] ” Handle Optimistic Lock Conflict`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-059` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-059` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-059.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-059.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-059 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-060] ” Handle Loading, Empty, and Error States

**GitHub title:** `[US-060] ” Handle Loading, Empty, and Error States`  
**Labels:** `user-story,tdd,area:security,layer:backend,layer:frontend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-060` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-060` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-060.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-060.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-060 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-061] ” Hide Soft-Deleted Tasks

**GitHub title:** `[US-061] ” Hide Soft-Deleted Tasks`  
**Labels:** `user-story,tdd,area:ops,layer:devops`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-061` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-061` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-061.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-061.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-061 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-062] ” Preserve Historical References

**GitHub title:** `[US-062] ” Preserve Historical References`  
**Labels:** `user-story,tdd,area:ops,layer:devops`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-062` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-062` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-062.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-062.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-062 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-063] ” Daily Database Backup

**GitHub title:** `[US-063] ” Daily Database Backup`  
**Labels:** `user-story,tdd,area:ops,layer:devops`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-063` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-063` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-063.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-063.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-063 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-064] ” Redis Recovery Behavior

**GitHub title:** `[US-064] ” Redis Recovery Behavior`  
**Labels:** `user-story,tdd,area:ops,layer:devops`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-064` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-064` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-064.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-064.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-064 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-065] ” No Public Registration

**GitHub title:** `[US-065] ” No Public Registration`  
**Labels:** `user-story,tdd,area:invariants,layer:backend,mvp-non-goal`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-065` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-065` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-065.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-065.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-065 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-066] ” No Email Notifications in MVP

**GitHub title:** `[US-066] ” No Email Notifications in MVP`  
**Labels:** `user-story,tdd,area:invariants,layer:backend,mvp-non-goal`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-066` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-066` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-066.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-066.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-066 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-067] ” No Attachments in MVP

**GitHub title:** `[US-067] ” No Attachments in MVP`  
**Labels:** `user-story,tdd,area:invariants,layer:backend,mvp-non-goal`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-067` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-067` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-067.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-067.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-067 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-068] ” No Cross-Project Dependencies

**GitHub title:** `[US-068] ” No Cross-Project Dependencies`  
**Labels:** `user-story,tdd,area:invariants,layer:backend,mvp-non-goal`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-068` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-068` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-068.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-068.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-068 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-069] ” Enforce Task-Project Ownership

**GitHub title:** `[US-069] ” Enforce Task-Project Ownership`  
**Labels:** `user-story,tdd,area:invariants,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-069` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-069` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-069.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-069.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-069 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-070] ” Enforce Active Project Members for Assignments

**GitHub title:** `[US-070] ” Enforce Active Project Members for Assignments`  
**Labels:** `user-story,tdd,area:invariants,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-070` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-070` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-070.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-070.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-070 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-071] ” Enforce Overdue Definition

**GitHub title:** `[US-071] ” Enforce Overdue Definition`  
**Labels:** `user-story,tdd,area:invariants,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-071` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-071` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-071.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-071.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-071 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

## Issue: [US-072] ” Enforce Comment Permanence

**GitHub title:** `[US-072] ” Enforce Comment Permanence`  
**Labels:** `user-story,tdd,area:invariants,layer:backend`  
**Milestone:** MVP  
**Project column:** Backlog  
**Source story:** `US-072` in `project_management_user_stories.md`  
**Source implementation tasks:** `US-072` in `tdd_layered_implementation_kanban_tasks.md`

### GitHub Issue Body

```md
## User Story
Copy the user story text from `project_management_user_stories.md` for US-072.

## Acceptance Criteria
Copy the Given/When/Then acceptance criteria for US-072.

## TDD Workflow
- [ ] Write failing tests from acceptance criteria.
- [ ] Confirm tests fail for the expected reason.
- [ ] Implement the smallest passing slice.
- [ ] Refactor while tests stay green.
- [ ] Add regression tests for discovered bugs.

## Layered Implementation Tasks
Copy the Database, Backend/API, Frontend/UI, and TDD task sections for US-072 from `tdd_layered_implementation_kanban_tasks.md`.

## Definition of Done
- [ ] Acceptance criteria pass as automated tests.
- [ ] Required database, backend, frontend, and test tasks are complete.
- [ ] Permissions, validation, edge cases, and standard errors are covered.
- [ ] Code reviewed and merged.
```

---

