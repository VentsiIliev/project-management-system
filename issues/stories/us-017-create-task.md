# US-017 - Create Task

## Metadata
- Area: 5. Task Management
- GitHub labels: `user-story`, `mvp`, `area:tasks`
- Suggested status: `:owner-review`
- Suggested wave: `Wave 0`
- Depends on: US-009, US-014
- Parallelization note: Start once dependencies are done; run in parallel with other stories in the same wave that do not share blocking dependencies.

## User Story
**As an** Admin or Project Manager  
**I want** to create tasks  
**So that** project work can be tracked.

## Acceptance Criteria

**Given** I have permission to create tasks  
**When** I create a task with valid fields  
**Then** the system creates the task with default TODO status.

**Given** the task is created  
**When** the system assigns a task number  
**Then** the task receives a globally unique task key using the project code.

**Given** the assignee is not an active project member  
**When** I submit the task  
**Then** the system rejects the request.

**Given** I am a Team Member  
**When** I attempt to create a task  
**Then** the system denies permission.

## Implementation Slice
**Slice goal:** deliver the first reviewable task foundation that makes task work visible in the project workspace immediately after creation.  
**Out of scope for this slice:** collaborators, subtasks, task detail route, status transitions, database-driven statuses and priorities, optimistic locking conflicts, activity logs, notifications, and search/filtering.

### Backend
- [x] Add the first `tasks` model with project link, task number, immutable task key, title, description, default TODO status, optional primary assignee, start/deadline dates, version, and soft-delete column.
- [x] Add `GET /api/projects/{project_id}/tasks` for visible project users so created tasks are visible immediately in the existing workspace.
- [x] Add `POST /api/projects/{project_id}/tasks` for Admins and active Project Managers only.
- [x] Generate the task key from immutable project code plus project-scoped task number.
- [x] Reject create requests when the primary assignee is not an active project member.
- [x] Reject create requests when deadline is earlier than start date.

### Frontend
- [x] Add a project tasks panel to the existing project workspace.
- [x] Show the current task list for the selected project.
- [x] Add a create-task form for Admins and active Project Managers.
- [x] Hide create controls for Team Members while keeping task visibility read-only.
- [x] Show structured server validation feedback in the form.

### Tests
- [x] Backend integration tests cover visible task listing, successful create, permission denial, inactive/non-member assignee rejection, and date validation.
- [x] Frontend tests cover task list loading, successful create from the workspace, and restricted Team Member behavior.

### Definition Of Done
- [x] A Project Manager or Admin can create a task and immediately see it in the selected project workspace.
- [x] The created task defaults to TODO and gets a task key based on the project code.
- [x] Team Members cannot create tasks.
- [x] Invalid assignees are rejected with structured validation errors.
