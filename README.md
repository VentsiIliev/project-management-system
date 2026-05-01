# Project Management System

This repository contains both the planning artifacts and the initial runnable scaffold for a new project-management application.

## Document Roles

- [docs/planning/project_spec_v4-1.md](./docs/planning/project_spec_v4-1.md): architecture, domain rules, API design, security, testing, and system invariants.
- [docs/planning/project_management_user_stories.md](./docs/planning/project_management_user_stories.md): user stories and acceptance criteria traced back to the spec.
- [docs/architecture/IMPLEMENTATION_ARCHITECTURE.md](./docs/architecture/IMPLEMENTATION_ARCHITECTURE.md): concrete implementation stack and repository architecture for execution agents.
- [docs/architecture/CODING_STANDARDS.md](./docs/architecture/CODING_STANDARDS.md): coding, reuse, and module-boundary rules for implementation agents.
- [docs/architecture/FRONTEND_STYLE_GUIDE.md](./docs/architecture/FRONTEND_STYLE_GUIDE.md): frontend styling, tokens, and customization rules.
- [issues](./issues): the working execution backlog, including local issue files, dependency mapping, Kanban structure, and foundational epics.
- [skills](./skills): repo-local agent skills, references, and durable implementation context.

## Runnable Scaffold

- [backend](./backend): Django backend scaffold
- [frontend](./frontend): React + Vite frontend scaffold
- [infra](./infra): infrastructure placeholders for local and deployment support
- [docker-compose.yml](./docker-compose.yml): local PostgreSQL and Redis
- [docs/development/LOCAL_DEVELOPMENT.md](./docs/development/LOCAL_DEVELOPMENT.md): exact startup flow for PyCharm and terminal use

## Docs Layout

- [docs/architecture](./docs/architecture): implementation contract, coding standards, and frontend style policy
- [docs/planning](./docs/planning): core product spec and user stories
- [docs/development](./docs/development): local setup and run instructions
- [docs/legacy](./docs/legacy): retained source material that is no longer the live backlog

## Backlog Guidance

The `issues` folder is now the working source for delivery planning.

- Start with [issues/review-findings.md](./issues/review-findings.md)
- Use [issues/story-index.md](./issues/story-index.md) to scan all story issues
- Use [issues/kanban-structure.md](./issues/kanban-structure.md) for board columns and flow
- Use [issues/dependency-map.md](./issues/dependency-map.md) for sequencing and parallelization

## Legacy Planning Files

The following files are retained as source material but should not be treated as the live backlog:

- [docs/legacy/github_issues_structure_tdd.md](./docs/legacy/github_issues_structure_tdd.md)
- [docs/legacy/tdd_layered_implementation_kanban_tasks.md](./docs/legacy/tdd_layered_implementation_kanban_tasks.md)

Their content has been normalized into the local `issues` backlog to reduce duplication and drift.
