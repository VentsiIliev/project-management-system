# Project Management App — Engineering Specification v4

> Single authoritative document. Supersedes v3 and v3.1.

---

## Table of Contents

1. Product Goal
2. Architecture Decisions
3. Core Architecture Modules
4. Users, Roles, and Permissions
5. Database Design
6. Workflow Rules
7. Authentication and User Onboarding
8. Authorization Enforcement
9. Session and Cookie Security
10. Password Policy
11. API Contract
12. Event, Notification, and WebSocket Design
13. Concurrency Strategy
14. Search, Filtering, and Pagination
15. UI Behavior Requirements
16. Frontend Architecture
17. Deployment and Infrastructure
18. Environment Configuration
19. Security Baseline
20. Observability Baseline
21. Backup and Recovery
22. Testing Strategy
23. MVP Feature List
24. Non-Goals for MVP
25. Key System Invariants

---

## 1. Product Goal

Build an internal company project and task management system that helps teams plan, assign, track, and coordinate work using projects, tasks, subtasks, Kanban boards, Gantt timelines, dependencies, comments, notifications, activity logs, search, and filtering.

The system must be easy to modify, extend, and customize over time while remaining practical for MVP development.

---

## 2. Architecture Decisions

### 2.1 Architecture Style

The system uses a **Modular Monolith** architecture.

The backend is deployed as one application, but the codebase is separated into clear modules:

- Users
- Projects
- Project Memberships
- Tasks
- Task Priorities
- Task Statuses
- Status Transitions
- Dependencies
- Comments
- Notifications
- Activity Logs

### 2.2 Reasoning

A modular monolith is preferred because:

- It is easier to build and deploy than microservices.
- It avoids distributed system complexity.
- It supports clean separation of business logic.
- It can be split into services later if needed.
- The domain data is highly relational.

### 2.3 Backend Stack

- Django
- Django REST Framework
- Django Channels for real-time comments
- PostgreSQL
- UUID primary keys

### 2.4 Frontend Stack

- React single-page application
- REST API integration
- Drag-and-drop Kanban interface
- Gantt chart visualization

### 2.5 API Style

The backend exposes a **structured REST API**.

Route style is hybrid/context-based:

```http
/projects/{project_id}/tasks
/tasks/{task_id}
/tasks/{task_id}/comments
/tasks/{task_id}/dependencies
```

### 2.6 Real-Time Strategy

MVP uses partial real-time behavior:

- Comments update instantly through WebSockets.
- Task/Kanban updates refresh through polling.
- Full real-time Kanban collaboration is future scope.

---

## 3. Core Architecture Modules

### 3.1 Project Module

Responsible for:

- Project creation
- Project updates
- Project deletion
- Project membership access
- Project code and task numbering counter

### 3.2 Task Module

Responsible for:

- Task creation
- Subtask creation
- Task updates
- Task deletion
- Assignment
- Status transitions
- Task validation
- Blocking state calculation

### 3.3 Dependency Module

Responsible for:

- Dependency creation
- Dependency deletion
- Same-project validation
- Cycle detection
- Blocking recalculation

### 3.4 Comment Module

Responsible for:

- Comment creation
- Comment retrieval
- WebSocket publishing
- Notification event trigger

### 3.5 Notification Module

Responsible for:

- Creating in-app notifications synchronously
- Listing notifications
- Marking notifications as read

### 3.6 Activity Log Module

Responsible for:

- Recording important domain events
- Preserving historical activity
- Displaying task history

---

## 4. Users, Roles, and Permissions

### 4.1 Global Role: Admin

Admins have system-wide access.

Admins can:

- Manage users (create, deactivate, reset passwords).
- Manage all projects.
- Access all tasks.
- Use Django Admin.
- Override role restrictions.
- Respect core invariants such as no circular dependencies and valid task hierarchy.

### 4.2 Project-Level Roles

A user can have different roles in different projects.

#### Project Manager

Can manage project structure and planning.

Project Managers can:

- Create projects.
- Edit projects they manage.
- Manage project members.
- Create tasks and subtasks.
- Edit planning fields.
- Assign users.
- Manage collaborators.
- Manage dependencies.
- Delete tasks.
- Change task status.
- Comment.

#### Team Member

Can execute and collaborate on assigned work.

Team Members can:

- View project tasks.
- View assigned tasks.
- Update task status.
- Edit task description.
- Comment.
- View activity logs.
- Receive notifications.

### 4.3 Permission Matrix

#### Project-Level Permissions

| Action | Admin | Project Manager | Team Member |
|---|:---:|:---:|:---:|
| Create project | Yes | Yes | No |
| Edit project | Yes | Yes | No |
| Delete project | Yes | Yes | No |
| Manage members | Yes | Yes | No |
| View project | Yes | Yes | Yes |

#### Task-Level Permissions

| Action | Admin | Project Manager | Team Member |
|---|:---:|:---:|:---:|
| Create task | Yes | Yes | No |
| Create subtask | Yes | Yes | No |
| Edit title | Yes | Yes | No |
| Edit description | Yes | Yes | Yes |
| Edit priority | Yes | Yes | No |
| Edit dates | Yes | Yes | No |
| Assign primary assignee | Yes | Yes | No |
| Manage collaborators | Yes | Yes | No |
| Manage dependencies | Yes | Yes | No |
| Delete task | Yes | Yes | No |
| Change status | Yes | Yes | Yes |
| Comment | Yes | Yes | Yes |
| View task | Yes | Yes | Yes |

### 4.4 Permission Rules

- Admins can bypass role restrictions.
- Admins must still respect core system invariants.
- Team Members cannot change planning fields.
- Team Members cannot manage dependencies.
- Team Members cannot delete tasks.
- Only project members can be assigned to tasks.
- Only project members can be collaborators.

---

## 5. Database Design

### 5.1 Global Database Decisions

- All primary keys use UUIDs generated server-side.
- Strict foreign key constraints are used.
- Hybrid deletion strategy:
  - Soft delete: projects, tasks, subtasks, project memberships, users.
  - Hard delete: not used in normal application flows; reserved for admin tooling only.
  - Comments: permanently immutable, no deletion path in MVP.
  - Activity logs: never deleted.

### 5.2 Soft Delete Convention

Soft-deleted records use:

```sql
deleted_at TIMESTAMP NULL
```

Default API queries exclude soft-deleted records.

Soft-deleted tasks are hidden from Kanban, Gantt, My Tasks, search, filters, and normal API responses.

Admins may inspect deleted records through admin/debug tools.

Activity logs are preserved even when referencing soft-deleted tasks or users.

### 5.3 Users Table

```sql
users
- id UUID PRIMARY KEY
- email VARCHAR NOT NULL UNIQUE
- name VARCHAR NOT NULL
- is_active BOOLEAN NOT NULL DEFAULT true
- is_admin BOOLEAN NOT NULL DEFAULT false
- must_reset_password BOOLEAN NOT NULL DEFAULT true
- last_login_at TIMESTAMP NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
- deleted_at TIMESTAMP NULL
```

Rules:

- User references are preserved even if the user is soft-deleted.
- Historical assignments remain visible.
- Deactivated users (`is_active = false`) cannot log in.
- Soft-deleted users cannot log in.
- Existing tasks are not automatically reassigned when users are deactivated.
- All newly created users have `must_reset_password = true` by default.

### 5.4 Projects Table

```sql
projects
- id UUID PRIMARY KEY
- name VARCHAR NOT NULL
- code VARCHAR NOT NULL UNIQUE
- description TEXT NULL
- owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
- task_counter INT NOT NULL DEFAULT 0
- start_date DATE NULL
- end_date DATE NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
- deleted_at TIMESTAMP NULL
```

Constraints:

```sql
CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
```

Rules:

- Project code is used for task keys, e.g. `PROJ-42`.
- Project code is **permanently immutable after creation**. It cannot be changed through any API or admin interface.
- `task_counter` is incremented atomically when creating tasks.
- Project deletion is soft delete handled at application level.

Indexes:

```sql
INDEX (code)
INDEX (owner_id)
INDEX (deleted_at)
```

### 5.5 Project Memberships Table

```sql
project_memberships
- id UUID PRIMARY KEY
- project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT
- user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
- role VARCHAR NOT NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
- deleted_at TIMESTAMP NULL
```

Constraints:

```sql
UNIQUE (project_id, user_id)
CHECK (role IN ('PROJECT_MANAGER', 'TEAM_MEMBER'))
```

Rules:

- A user can belong to many projects with different roles per project.
- Soft-deleted memberships are ignored in permission checks.
- `ON DELETE RESTRICT` on both FKs prevents accidental cascades; all deletion is handled at application level.

### 5.6 Task Priorities Table

Priorities are database-driven and configurable.

```sql
task_priorities
- id UUID PRIMARY KEY
- name VARCHAR NOT NULL UNIQUE
- sort_order INT NOT NULL
- color VARCHAR NULL
- is_active BOOLEAN NOT NULL DEFAULT true
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
```

Default seed values: LOW, MEDIUM, HIGH, URGENT.

Rules:

- Priorities are editable by admins.
- Inactive priorities cannot be assigned to new tasks.
- Existing tasks may continue referencing inactive priorities.

### 5.7 Task Statuses Table

```sql
task_statuses
- id UUID PRIMARY KEY
- name VARCHAR NOT NULL UNIQUE
- sort_order INT NOT NULL
- is_final BOOLEAN NOT NULL DEFAULT false
- is_active BOOLEAN NOT NULL DEFAULT true
- color VARCHAR NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
```

Default seed values: TODO, IN_PROGRESS, DONE.

Rules:

- BLOCKED is not a status. It is computed from dependencies.
- DONE must be marked `is_final = true`.
- Statuses are global for MVP. Schema allows project-specific statuses later.
- When a status is deactivated, its Kanban column still renders and is marked as inactive. Tasks using that status remain visible, but no new tasks can be dropped into that column.

### 5.8 Task Status Transitions Table

```sql
task_status_transitions
- id UUID PRIMARY KEY
- from_status_id UUID NOT NULL REFERENCES task_statuses(id) ON DELETE RESTRICT
- to_status_id UUID NOT NULL REFERENCES task_statuses(id) ON DELETE RESTRICT
- name VARCHAR NULL
- is_active BOOLEAN NOT NULL DEFAULT true
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
```

Constraints:

```sql
UNIQUE (from_status_id, to_status_id)
CHECK (from_status_id != to_status_id)
```

Default transitions: TODO → IN_PROGRESS, IN_PROGRESS → DONE, DONE → IN_PROGRESS.

Rules:

- Transitions are global for MVP. Schema allows project-specific transitions later.
- Status changes must use the dedicated status endpoint.

### 5.9 Tasks Table

```sql
tasks
- id UUID PRIMARY KEY
- project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT
- task_number INT NOT NULL
- task_key VARCHAR NOT NULL UNIQUE
- title VARCHAR NOT NULL
- description TEXT NULL
- parent_task_id UUID NULL REFERENCES tasks(id) ON DELETE CASCADE
- status_id UUID NOT NULL REFERENCES task_statuses(id) ON DELETE RESTRICT
- priority_id UUID NULL REFERENCES task_priorities(id) ON DELETE SET NULL
- primary_assignee_id UUID NULL REFERENCES users(id) ON DELETE SET NULL
- created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
- start_date DATE NULL
- deadline DATE NULL
- version INT NOT NULL DEFAULT 1
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL
- deleted_at TIMESTAMP NULL
```

Constraints:

```sql
UNIQUE (project_id, task_number)
UNIQUE (task_key)
CHECK (deadline IS NULL OR start_date IS NULL OR deadline >= start_date)
CHECK (parent_task_id IS NULL OR parent_task_id != id)
```

Application-level constraints:

- Parent task and subtask must belong to the same project.
- A subtask cannot have its own subtasks (max one level of nesting).
- A parent task cannot be marked DONE unless all subtasks are DONE.
- If a subtask is reopened from DONE, the parent task is automatically reopened.
- Assigned users must be active project members.
- Collaborators must be active project members.

Indexes:

```sql
INDEX (project_id)
INDEX (status_id)
INDEX (priority_id)
INDEX (primary_assignee_id)
INDEX (parent_task_id)
INDEX (deadline)
INDEX (deleted_at)
INDEX (task_key)
INDEX (title)
```

### 5.10 Task Collaborators Table

```sql
task_collaborators
- task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE
- user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
- created_at TIMESTAMP NOT NULL
PRIMARY KEY (task_id, user_id)
```

Rules:

- Collaborators must be members of the task's project.
- Primary assignee should not be duplicated as a collaborator.

### 5.11 Task Dependencies Table

```sql
task_dependencies
- id UUID PRIMARY KEY
- task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE
- depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE
- created_at TIMESTAMP NOT NULL
```

Semantics: `task_id` depends on `depends_on_task_id` — meaning `task_id` is blocked until `depends_on_task_id` reaches a final status.

Constraints:

```sql
CHECK (task_id != depends_on_task_id)
UNIQUE (task_id, depends_on_task_id)
```

Application-level constraints:

- Both tasks must belong to the same project.
- Circular dependencies are forbidden.
- Dependency graph must remain acyclic.
- DFS or equivalent cycle detection must run inside a transaction before inserting.

Indexes:

```sql
INDEX (task_id)
INDEX (depends_on_task_id)
```

### 5.12 Comments Table

Comments are permanently immutable. There is no edit or delete endpoint in MVP or beyond unless explicitly re-scoped.

```sql
comments
- id UUID PRIMARY KEY
- task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE
- author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
- content TEXT NOT NULL
- created_at TIMESTAMP NOT NULL
```

Rules:

- Comments cannot be edited.
- Comments cannot be deleted.
- Empty comments are rejected.
- Comments are broadcast to connected task viewers through WebSockets.

### 5.13 Notifications Table

```sql
notifications
- id UUID PRIMARY KEY
- user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- type VARCHAR NOT NULL
- payload JSONB NOT NULL
- is_read BOOLEAN NOT NULL DEFAULT false
- created_at TIMESTAMP NOT NULL
```

Rules:

- Notifications are in-app only in MVP.
- Email notifications are future scope.
- Notification preferences are future scope.
- All list endpoints including notifications require pagination.

### 5.14 Activity Logs Table

```sql
activity_logs
- id UUID PRIMARY KEY
- actor_id UUID NULL REFERENCES users(id) ON DELETE SET NULL
- task_id UUID NULL REFERENCES tasks(id) ON DELETE SET NULL
- project_id UUID NULL REFERENCES projects(id) ON DELETE SET NULL
- action_type VARCHAR NOT NULL
- old_value JSONB NULL
- new_value JSONB NULL
- metadata JSONB NULL
- created_at TIMESTAMP NOT NULL
```

Valid `action_type` values (fixed enumeration, enforced by application):

```
TASK_CREATED
TASK_UPDATED
TASK_ASSIGNED
TASK_STATUS_CHANGED
TASK_DELETED
SUBTASK_CREATED
SUBTASK_DELETED
DEPENDENCY_ADDED
DEPENDENCY_REMOVED
COMMENT_CREATED
PARENT_REOPENED
PROJECT_DELETED
MEMBER_ADDED
MEMBER_REMOVED
MEMBER_REASSIGNED
USER_CREATED
PASSWORD_RESET
```

Rules:

- Activity logs are never deleted by normal task or project deletion.
- Activity logs preserve audit history even when referencing deleted entities.

---

## 6. Workflow Rules

### 6.1 Task Statuses

MVP statuses: TODO, IN_PROGRESS, DONE. Stored in the database.

### 6.2 Overdue Definition

A task is overdue when:

- `deadline < today` (strictly before today), AND
- The task's current status is not final (`is_final = false`).

Tasks with no deadline are never overdue. Tasks in a final status (DONE) are never overdue regardless of deadline.

### 6.3 Blocking State

BLOCKED is computed, not stored.

A task is blocked when it has at least one dependency whose status is not final.

Rules:

- Blocked tasks show a blocked indicator in UI.
- Blocked tasks cannot transition to IN_PROGRESS or DONE.
- If a task is already IN_PROGRESS and becomes blocked, it stays IN_PROGRESS but shows blocked indicator.
- Blocked IN_PROGRESS tasks cannot move to DONE until unblocked.

### 6.4 Parent/Subtask Rules

- Only one level of subtasks is allowed.
- A subtask cannot have children.
- Parent and subtask must be in the same project.
- Parent task cannot be DONE unless all subtasks are DONE.
- If a subtask changes from DONE to non-DONE, the parent automatically reopens.
- Parent task deletion cascades to subtasks only after explicit user confirmation.

### 6.5 Dependency Rules

- Dependencies are allowed only within the same project.
- Root tasks and subtasks can depend on each other within the same project.
- Duplicate dependencies are forbidden.
- Self-dependencies are forbidden.
- Circular dependencies are forbidden.
- Graph must always remain acyclic.

### 6.6 Gantt Conflict Rules

A Gantt conflict occurs when task B depends on task A but task B's start date is earlier than task A's deadline.

Rules:

- Conflicts show warnings.
- Conflicts highlight affected tasks and dependency links.
- Saving conflicting dates is allowed.
- The system never auto-adjusts dates.
- Users manually resolve conflicts.

Warning message:

```
Task starts before its dependency is completed.
```

---

## 7. Authentication and User Onboarding

### 7.1 Authentication Method

The MVP uses **email and password authentication** with **Django session-based transport**.

| Decision | Choice |
|---|---|
| Login identifier | Email |
| Password authentication | Yes |
| Public registration | No |
| Session auth | Yes (MVP) |
| JWT auth | Future option |
| SSO/OAuth | Future option |
| Admin-created users | Yes |
| Force password reset on first login | Yes |

JWT authentication may be added later if the frontend and backend are deployed on separate domains, mobile clients are added, or external API consumers are introduced.

### 7.2 First Admin Bootstrap

The first admin user is created via a **Django management command** that reads credentials from environment variables. This command is idempotent and is run once during initial deployment.

```bash
python manage.py bootstrap_admin
```

Required environment variables for bootstrap:

```
BOOTSTRAP_ADMIN_EMAIL
BOOTSTRAP_ADMIN_NAME
BOOTSTRAP_ADMIN_PASSWORD
```

The command creates an admin user with `must_reset_password = false` (admin sets their own password directly via env). If a user with that email already exists, the command exits without changes.

### 7.3 User Creation Flow

Users are created by an Admin. There is no public sign-up form.

Flow:

1. Admin creates a user account via API with name, email, and temporary password.
2. System sets `must_reset_password = true`.
3. User logs in for the first time.
4. System detects `must_reset_password = true` and forces the user to the reset screen.
5. User sets a new password. System sets `must_reset_password = false`.
6. User accesses the main application.

### 7.4 User Creation Rules

- Only Admins can create users.
- User email must be unique and valid.
- Newly created users are active by default unless Admin sets them inactive.
- Temporary password must comply with the password policy (§10).
- `must_reset_password` is always `true` for admin-created users.

### 7.5 Admin Password Reset for Existing Users

When an existing user forgets their password, the Admin sets a new temporary password via API. This resets `must_reset_password = true`, forcing the user through the same first-login flow on their next login.

API:

```http
POST /admin/users/{user_id}/reset-password
```

Request:

```json
{
  "new_temporary_password": "Temp1234!"
}
```

Rules:

- Admin-only endpoint.
- Validates new password against password policy.
- Sets `must_reset_password = true`.
- Does not invalidate the user's existing session (they must log out or wait for session expiry).

### 7.6 User Management API

```http
GET    /admin/users
POST   /admin/users
GET    /admin/users/{user_id}
PATCH  /admin/users/{user_id}
POST   /admin/users/{user_id}/reset-password
DELETE /admin/users/{user_id}   (soft delete)
```

Create user request:

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "temporary_password": "Temp1234!",
  "is_active": true
}
```

PATCH supports: `name`, `email`, `is_active`.

All user management endpoints are Admin-only.

### 7.7 Authentication API

#### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "temporary-or-current-password"
}
```

Response:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "is_admin": false,
    "must_reset_password": true
  },
  "requires_password_reset": true
}
```

Behavior:

- Creates a Django session and sets session cookie.
- Requires CSRF handling.
- Returns current user information.
- If `must_reset_password = true`, frontend must redirect to password reset screen before allowing access to any other page.

Failure cases:

- Invalid credentials → generic error (do not reveal whether email exists or which field is wrong).
- Inactive user → generic error.
- Soft-deleted user → generic error.

#### Logout

```http
POST /auth/logout
```

Ends the current session and clears the session cookie.

#### Get Current User

```http
GET /auth/me
```

Returns the authenticated user. Returns 401 if not authenticated.

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "is_admin": false,
  "must_reset_password": false
}
```

#### Change Password (normal flow)

```http
POST /auth/change-password
```

Request:

```json
{
  "current_password": "old-password",
  "new_password": "new-password"
}
```

Requires active session. Validates current password. Validates new password policy.

#### Force Reset Password (first-login flow)

```http
POST /auth/force-reset-password
```

Request:

```json
{
  "new_password": "new-password"
}
```

Used when `must_reset_password = true`. Does not require current password — the user already authenticated with the temporary password. Validates new password policy. Sets `must_reset_password = false` on success.

---

## 8. Authorization Enforcement

### 8.1 Rules

Every API endpoint must enforce permissions server-side. Frontend hiding of actions is not a substitute for backend authorization.

Authorization considers:

- Is the user authenticated?
- Is the user active and not soft-deleted?
- Is the user an admin?
- Is the user a member of the project?
- What role does the user have in the project?
- Is the requested action allowed for that role?

### 8.2 Admin Override

Admins may bypass role restrictions, but must still respect core system invariants:

- No circular dependencies.
- No invalid task hierarchy.
- No cross-project dependencies.
- No invalid parent/subtask completion states.

### 8.3 Project and Member Deletion Behavior

**Project deletion** soft-deletes the project, all project tasks, all subtasks, and all project memberships. No data is hard-deleted. Activity logs are preserved. Deleted projects are excluded from all normal API responses, Kanban, Gantt, My Tasks, search, and filters. Requires explicit confirmation flag in the API request.

**Member removal** soft-deletes the project membership. The removed user loses project access and stops receiving project notifications. Existing task assignments are preserved and visible (labeled as inactive). Tasks are not automatically reassigned. Project Managers and Admins may reassign tasks manually. Reassignment creates an activity log entry.

Inactive assignment display label:

```
Jane Doe (removed from project)
```

---

## 9. Session and Cookie Security

### 9.1 Session Duration

Sessions expire after **8 hours** of inactivity. There is no "remember me" option in MVP.

Django configuration:

```python
SESSION_COOKIE_AGE = 28800  # 8 hours in seconds
SESSION_SAVE_EVERY_REQUEST = True  # Reset timer on activity
```

### 9.2 Session Rules

- Sessions are required for authenticated API access.
- Logout invalidates the session immediately.
- Inactive and soft-deleted users cannot create new sessions.

### 9.3 Production Cookie Settings

```python
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
```

### 9.4 CSRF

Session-based authentication requires CSRF protection on all unsafe HTTP methods: POST, PATCH, PUT, DELETE. Frontend must include CSRF token in all unsafe requests.

---

## 10. Password Policy

### 10.1 MVP Requirements

Applies to all passwords: user-set passwords and admin-set temporary passwords.

- Minimum 8 characters.
- Must not be entirely numeric.
- Must not be too similar to the user's email or name.
- Must not be a commonly used password.

Django's built-in password validators satisfy these requirements.

### 10.2 Future Enhancements

- Password expiration policy.
- Password history prevention.
- Two-factor authentication.
- SSO-based authentication.
- Admin password reset email flow.

---

## 11. API Contract

### 11.1 General Rules

- API uses JSON.
- All IDs are UUID strings.
- Error responses use a standard error format.
- Pagination is required for all list endpoints.
- Soft-deleted records are excluded by default.
- Mutating task endpoints use optimistic locking.

### 11.2 Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "title": "This field is required"
    }
  }
}
```

Error codes:

```
VALIDATION_ERROR
PERMISSION_DENIED
NOT_FOUND
CONFLICT
OPTIMISTIC_LOCK_FAILED
INVALID_STATUS_TRANSITION
TASK_BLOCKED
SUBTASKS_INCOMPLETE
DEPENDENCY_CYCLE
DUPLICATE_DEPENDENCY
CROSS_PROJECT_DEPENDENCY
INVALID_HIERARCHY
INVALID_CREDENTIALS
PROJECT_CODE_IMMUTABLE
```

### 11.3 Pagination Format

```json
{
  "results": [],
  "pagination": {
    "page": 1,
    "page_size": 25,
    "total": 100,
    "total_pages": 4
  }
}
```

Query params: `?page=1&page_size=25`

### 11.4 Project Endpoints

```http
GET    /projects
POST   /projects
GET    /projects/{project_id}
PATCH  /projects/{project_id}
DELETE /projects/{project_id}
```

Create project request:

```json
{
  "name": "Engineering Platform",
  "code": "ENG",
  "description": "Internal engineering work",
  "start_date": "2026-05-01",
  "end_date": "2026-06-01"
}
```

Project code is set at creation and cannot be changed. Any PATCH request including `code` returns `PROJECT_CODE_IMMUTABLE`.

Delete project request:

```json
{
  "confirm_project_delete": true
}
```

Missing confirmation flag causes the backend to reject the request.

### 11.5 Project Membership Endpoints

```http
GET    /projects/{project_id}/members
POST   /projects/{project_id}/members
PATCH  /projects/{project_id}/members/{user_id}
DELETE /projects/{project_id}/members/{user_id}
```

Add member request:

```json
{
  "user_id": "uuid",
  "role": "TEAM_MEMBER"
}
```

### 11.6 Task Endpoints

#### List Project Tasks

```http
GET /projects/{project_id}/tasks
```

Supported filters: `status_id`, `priority_id`, `primary_assignee_id`, `deadline_from`, `deadline_to`, `search`, `is_blocked`.

The `search` parameter performs substring matching against `title`, `description`, and `task_key`. Search is always scoped to the specified project. Users only see tasks from projects they have access to.

#### Create Task

```http
POST /projects/{project_id}/tasks
```

Request:

```json
{
  "title": "Implement login",
  "description": "Add authentication flow",
  "priority_id": "uuid",
  "start_date": "2026-05-01",
  "deadline": "2026-05-05",
  "primary_assignee_id": "uuid",
  "collaborator_ids": ["uuid"],
  "parent_task_id": "uuid"
}
```

Response:

```json
{
  "id": "uuid",
  "task_key": "ENG-12",
  "status": { "id": "uuid", "name": "TODO" },
  "version": 1,
  "created_at": "2026-05-01T10:00:00Z"
}
```

#### Get Task

```http
GET /tasks/{task_id}
```

Response:

```json
{
  "id": "uuid",
  "task_key": "ENG-12",
  "title": "Implement login",
  "description": "Add authentication flow",
  "project_id": "uuid",
  "status": { "id": "uuid", "name": "IN_PROGRESS", "is_final": false },
  "priority": { "id": "uuid", "name": "HIGH" },
  "primary_assignee": { "id": "uuid", "name": "Jane Doe" },
  "collaborators": [],
  "is_blocked": true,
  "is_overdue": false,
  "start_date": "2026-05-01",
  "deadline": "2026-05-05",
  "version": 3,
  "subtasks": [],
  "dependencies": []
}
```

#### Update Task

```http
PATCH /tasks/{task_id}
```

Request:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority_id": "uuid",
  "start_date": "2026-05-02",
  "deadline": "2026-05-07",
  "primary_assignee_id": "uuid",
  "collaborator_ids": ["uuid"],
  "version": 3
}
```

Rules: Managers/Admins can update planning fields. Team Members can update description only. `version` is required for optimistic locking.

#### Change Task Status

```http
POST /tasks/{task_id}/status
```

Request:

```json
{
  "to_status_id": "uuid",
  "version": 3
}
```

Rules: Must validate transition, blocking state, parent/subtask completion rules. `version` is required.

#### Delete Task

```http
DELETE /tasks/{task_id}
```

Optional request body for parent tasks with subtasks:

```json
{
  "confirm_cascade_subtasks": true
}
```

Admin or Project Manager only.

### 11.7 Dependency Endpoints

```http
GET    /tasks/{task_id}/dependencies
POST   /tasks/{task_id}/dependencies
DELETE /tasks/{task_id}/dependencies/{depends_on_task_id}
```

Add dependency request:

```json
{
  "depends_on_task_id": "uuid"
}
```

Rules: Same project only. No duplicate. No self-dependency. No cycles.

### 11.8 Comment Endpoints

```http
GET  /tasks/{task_id}/comments
POST /tasks/{task_id}/comments
```

Add comment request:

```json
{
  "content": "This is blocked by API work."
}
```

Rules: Comments are immutable — no edit or delete endpoint exists.

### 11.9 Notification Endpoints

```http
GET  /notifications
POST /notifications/{notification_id}/read
POST /notifications/read-all
```

Supported filter: `?unread=true`. Pagination is required.

### 11.10 Activity Log Endpoints

```http
GET /tasks/{task_id}/activity
GET /projects/{project_id}/activity
```

### 11.11 Workflow Metadata Endpoints

```http
GET /task-statuses
GET /task-status-transitions
GET /task-priorities
```

---

## 12. Event, Notification, and WebSocket Design

### 12.1 Internal Domain Events

```
TASK_CREATED
TASK_UPDATED
TASK_ASSIGNED
TASK_STATUS_CHANGED
TASK_DELETED
SUBTASK_CREATED
SUBTASK_DELETED
DEPENDENCY_ADDED
DEPENDENCY_REMOVED
COMMENT_CREATED
PARENT_REOPENED
```

### 12.2 Event Flow

```
Service action
→ domain validation
→ database write
→ activity log creation
→ event emitted
→ notification service creates notifications synchronously
```

### 12.3 Notification Recipients

Relevant users for a task event:

- Primary assignee
- Collaborators
- Task creator
- Users who previously commented on the task

Rules:

- The actor does not receive a notification for their own action.
- Project-wide members are not notified unless directly relevant.
- Removed project members do not receive notifications.
- Notifications are in-app only in MVP.

### 12.4 WebSocket Comment Channel

```
ws/tasks/{task_id}/comments
```

Comment created event payload:

```json
{
  "type": "COMMENT_CREATED",
  "payload": {
    "task_id": "uuid",
    "comment": {
      "id": "uuid",
      "content": "Comment text",
      "author": { "id": "uuid", "name": "Jane Doe" },
      "created_at": "2026-05-01T10:00:00Z"
    }
  }
}
```

WebSocket security rules:

- Only authenticated users with access to the task may connect.
- Connection is rejected for unauthorized users.
- Comments are persisted through REST API before broadcast.

### 12.5 WebSocket Reconnection

When the frontend WebSocket connection drops:

1. Attempt reconnection with exponential backoff: 1s, 2s, 4s, 8s, max 30s.
2. Show a subtle "reconnecting…" status indicator while disconnected.
3. On successful reconnect, fetch missed comments via `GET /tasks/{task_id}/comments` using the timestamp of the last received comment.
4. Dismiss the reconnecting indicator.

---

## 13. Concurrency Strategy

### 13.1 Optimistic Locking

Tasks include a `version INT NOT NULL DEFAULT 1` field.

Rules:

- Mutating task endpoints require the client to submit the current `version`.
- If submitted version does not match the current database version, the update is rejected.
- Successful updates increment `version`.
- Client must refresh and retry manually.

Error response:

```json
{
  "error": {
    "code": "OPTIMISTIC_LOCK_FAILED",
    "message": "Task was modified by another user. Please refresh and try again.",
    "details": { "current_version": 4 }
  }
}
```

### 13.2 Task Number Generation

Task numbers are generated atomically per project.

Rules:

- Project row is locked or updated atomically (row-level lock or atomic SQL update returning new counter).
- `task_counter` increments by 1.
- New task receives the incremented number.
- `task_key` is stored as `{project.code}-{task_number}`.
- Unique constraints protect against duplicates.

### 13.3 Dependency Race Conditions

When creating dependencies:

1. Validate same project.
2. Run cycle detection inside a transaction.
3. Insert dependency.
4. Commit transaction.

If a concurrent dependency creation would form a cycle, one transaction is rejected.

### 13.4 Status Race Conditions

When changing status:

1. Check optimistic version.
2. Validate transition.
3. Validate blocking state.
4. Validate parent/subtask completion rules.
5. Update status.
6. Increment version.

---

## 14. Search, Filtering, and Pagination

### 14.1 Search

Task search is performed per-project using `GET /projects/{project_id}/tasks?search=...`.

Supports substring match against: `title`, `description`, `task_key`.

Rules:

- Users only see tasks from projects they have access to.
- Soft-deleted tasks are excluded.
- Search can combine with other filters.

### 14.2 Filters

Supported task filters: `status_id`, `priority_id`, `primary_assignee_id`, `deadline_from`, `deadline_to`, `is_blocked`.

### 14.3 Pagination

All list endpoints require pagination. See §11.3 for the response format.

---

## 15. UI Behavior Requirements

### 15.1 Kanban

Kanban must show:

- Columns ordered by task status `sort_order`.
- Task cards grouped by status.
- Blocked indicator.
- Overdue indicator (per §6.2 definition).
- Priority.
- Assignee.
- Task key.
- Deactivated status columns rendered but visually marked as inactive.

Drag-and-drop rules:

- Invalid transitions are rejected.
- Blocked tasks cannot move to IN_PROGRESS or DONE.
- Parent tasks cannot move to DONE if subtasks are incomplete.
- Tasks cannot be dropped into a column with an inactive status.
- Rejected moves snap back to the previous column.
- Successful moves update status through the status endpoint.

### 15.2 Gantt

Gantt must show:

- Task timeline from `start_date` to `deadline`.
- Dependency links.
- Conflict warnings.
- Blocked indicators.
- Overdue indicators (per §6.2 definition).
- Subtask grouping under parent tasks.

Interaction model:

- The Gantt is **read-only** in MVP. Dates are not draggable.
- Clicking a task bar opens the task detail view.
- Date changes are made through the task detail form.

Conflict warning:

```
Task starts before its dependency is completed.
```

### 15.3 My Tasks

My Tasks must show:

- Tasks where the current user is primary assignee.
- Optionally collaborator tasks.
- Sorting by deadline and priority.
- Overdue highlighting (per §6.2 definition).
- Blocked indicator.

### 15.4 Notifications

Notification UI must show:

- Newest first.
- Unread indicator.
- Mark as read.
- Mark all as read.
- Empty state.
- Pagination support.

### 15.5 Confirmation Dialogs

Project deletion confirmation message:

```
Deleting this project will hide the project, its tasks, subtasks, memberships, comments, dependencies, and related work from normal users. Activity logs will be preserved. This action cannot be undone in the MVP.
```

Parent task deletion with subtasks confirmation message:

```
This task has subtasks. Deleting it will also delete all associated subtasks. This action cannot be undone.
```

---

## 16. Frontend Architecture

### 16.1 Module Structure

The frontend is organized by feature modules:

- `auth`
- `projects`
- `tasks`
- `kanban`
- `gantt`
- `notifications`
- `admin`
- `shared`
- `api`
- `components`

### 16.2 API Client

A centralized API client handles:

- Attaching CSRF token to all unsafe requests.
- Including session credentials.
- Handling structured API errors.
- Handling 401 unauthenticated responses (redirect to login).
- Handling 403 permission errors.
- Handling optimistic locking errors.

### 16.3 Optimistic Lock Handling

When the API returns `OPTIMISTIC_LOCK_FAILED`, the frontend:

1. Shows message: `This task was changed by someone else. Please refresh and try again.`
2. Refreshes the task data.
3. Allows the user to retry their change manually.

### 16.4 Auth Guards

Frontend routes must guard protected pages:

- Unauthenticated users are redirected to login.
- Users with `must_reset_password = true` are redirected to the password reset screen and cannot access any other page until reset is complete.
- Users without project access cannot view project pages.
- Forbidden actions are hidden in the UI but still enforced by the backend.

### 16.5 State Management

Frontend must implement consistent states for:

- loading
- empty list
- validation error
- permission denied
- network error
- optimistic lock conflict
- deleted/not found resource
- WebSocket reconnecting

---

## 17. Deployment and Infrastructure

### 17.1 Deployment Decision

The MVP uses a simple, non-Docker deployment. Docker may be added later without restructuring the codebase.

### 17.2 Runtime Components

- Django backend (Gunicorn for HTTP, ASGI server for WebSockets)
- React static frontend build
- PostgreSQL database
- Redis server
- Nginx reverse proxy

### 17.3 Recommended Topology

```
User Browser
  ↓
Nginx
  ├── React Static Build
  ├── Django REST API via Gunicorn/WSGI
  └── Django Channels WebSocket via Daphne or Uvicorn (ASGI)
        ↓
PostgreSQL
Redis
```

### 17.4 Component Responsibilities

**Gunicorn/Django**: REST API, authentication, permissions, database access, business logic, notification creation, activity logging.

**ASGI server (Daphne or Uvicorn)**: WebSocket handling via Django Channels.

**Nginx**: Serve React static build, proxy API requests to Django, proxy WebSocket requests with upgrade headers, serve static/media files, enforce HTTPS in production.

**Redis**: Django Channels channel layer for WebSocket fan-out. Not used for durable data storage. Redis persistence is not required.

**PostgreSQL**: All durable data.

### 17.5 Future Docker Setup

May include: backend container, frontend build container, PostgreSQL container, Redis container, Nginx container.

---

## 18. Environment Configuration

### 18.1 Required Environment Variables

```
DJANGO_SECRET_KEY
DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS
DATABASE_URL
REDIS_URL
CSRF_TRUSTED_ORIGINS
CORS_ALLOWED_ORIGINS
SESSION_COOKIE_SECURE
CSRF_COOKIE_SECURE

# Used only during initial bootstrap
BOOTSTRAP_ADMIN_EMAIL
BOOTSTRAP_ADMIN_NAME
BOOTSTRAP_ADMIN_PASSWORD
```

### 18.2 Environment Types

- **local**: Django development server, local PostgreSQL, local Redis, React dev server.
- **staging**: Mirrors production. Used for QA, deployment validation, integration and security testing.
- **production**: Debug disabled, HTTPS enforced, secure cookies, restricted allowed hosts, restricted CORS origins.

---

## 19. Security Baseline

### 19.1 Authentication Security

- All protected endpoints require authentication.
- Inactive and soft-deleted users cannot authenticate.
- `must_reset_password = true` blocks access to all endpoints except `/auth/force-reset-password` and `/auth/logout`.

### 19.2 Rate Limiting

Rate limiting applies to **all authentication endpoints**: `/auth/login`, `/auth/change-password`, `/auth/force-reset-password`.

Rules:

- Limit repeated failed attempts by IP and by email.
- Return generic error messages that do not reveal whether an email exists, whether the account is inactive, or which credential is wrong.

Generic error response:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password.",
    "details": {}
  }
}
```

### 19.3 CORS Policy

- No wildcard CORS in production.
- Only trusted frontend domains are allowed via `CORS_ALLOWED_ORIGINS`.
- Credentials must be supported if frontend and backend are on separate trusted origins.

### 19.4 API Security

All API endpoints must:

- Require authentication unless explicitly public.
- Validate permissions server-side.
- Validate and sanitize input.
- Return structured errors.
- Avoid leaking unauthorized resource existence where appropriate (return 404 instead of 403 where suitable).

### 19.5 WebSocket Security

WebSocket connections must:

- Require authenticated user with active session.
- Verify the user has access to the task.
- Reject connections for unauthorized users.
- Not broadcast comments to users without task access.

---

## 20. Observability Baseline

### 20.1 Application Log Events

Log the following events server-side:

- Login success / failure
- Logout
- User creation
- Password reset
- Project deletion
- Member removal
- Task deletion
- Permission denied events
- Unexpected server errors

### 20.2 Log Structure

Error logs should include: timestamp, request path, user id if authenticated, error type, stack trace, correlation/request id if available.

### 20.3 Audit vs. Application Logs

**Activity logs** are product-level, user-visible audit records (task history, project events). They live in the database and are queried through the API.

**Application logs** are operational records for developers and operators (debugging, security review, monitoring). They are separate from activity logs and live in server log files or a log aggregator.

### 20.4 Future Monitoring

Sentry for error tracking, Prometheus/Grafana for metrics, uptime checks, request tracing, structured JSON logs.

---

## 21. Backup and Recovery

### 21.1 Database Backup Policy

- Daily automated PostgreSQL backups.
- Retain backups for at least 7 days.
- Test restore process before production launch.

### 21.2 Redis

Redis is used only for WebSocket channel layer. No durable business data is stored in Redis. Redis persistence is not required. If Redis is lost, active WebSocket connections disconnect; users reconnect automatically.

### 21.3 Recovery

PostgreSQL loss: restore from latest backup. Recent data may be lost depending on backup timing.

Redis loss: no durable data lost. WebSocket reconnections happen automatically per the frontend reconnection spec (§12.5).

---

## 22. Testing Strategy

### 22.1 Unit Tests

Must cover:

- Task creation validation.
- Subtask hierarchy validation.
- Parent completion rules.
- Parent reopen behavior.
- Dependency same-project validation.
- Dependency cycle detection.
- Blocking state calculation.
- Overdue calculation.
- Status transition validation.
- Permission checks per role.
- Notification recipient selection.

### 22.2 Integration Tests

Must cover:

- Create task through API.
- Change status through API.
- Create dependency through API.
- Reject circular dependency.
- Add comment and create notification.
- WebSocket comment broadcast.
- Optimistic locking conflict.
- Kanban drag status change flow.
- Gantt conflict detection.
- First-login password reset flow.
- Admin user creation flow.
- Member removal and access revocation.

### 22.3 Permission Tests

Must cover:

- Admin access to all resources.
- Project Manager access.
- Team Member access.
- Non-member access denied.
- Team Member cannot edit planning fields.
- Team Member can edit description.
- Team Member can comment.
- Team Member cannot delete tasks.
- Removed member cannot access project.
- User with `must_reset_password = true` cannot access main application endpoints.

### 22.4 Concurrency Tests

Must cover:

- Two users creating tasks simultaneously in the same project.
- Two users updating the same task version.
- Dependency creation race condition.
- Status change while dependency changes concurrently.

---

## 23. MVP Feature List

- User management (admin-created, password reset, deactivation)
- First admin bootstrap via management command
- Project management with immutable project codes
- Project-level roles (Project Manager, Team Member)
- Task management with atomic task numbering
- One-level subtasks
- Primary assignee and collaborators
- Database-driven priorities
- Database-driven statuses with overdue computation
- Database-driven status transitions
- Restricted workflow
- Dependency management with cycle detection
- Computed blocked state
- Kanban board with inactive status column support
- Read-only Gantt chart (clickable, opens task detail)
- Gantt conflict warnings
- Real-time comments via WebSocket with reconnection
- Polling-based task refresh
- In-app notifications with pagination
- Activity log with fixed action_type enumeration
- Per-project task search and filtering
- Structured REST API
- Optimistic locking
- Session-based auth with 8-hour timeout
- Rate-limited auth endpoints
- Django Admin panel

---

## 24. Non-Goals for MVP

- Public user registration
- JWT authentication
- SSO / OAuth
- Two-factor authentication
- Email invitations
- Email notifications
- Notification preferences
- File attachments
- Task restore after soft delete
- Project restore
- Comment editing or deletion
- Draggable Gantt bars (date editing via drag)
- Cross-project dependencies
- Multi-level nested subtasks
- Full real-time Kanban collaboration
- Auto-shifting deadlines
- Time tracking
- Saved filters
- Advanced analytics or reporting
- Custom workflow builder
- Docker deployment requirement
- Kubernetes
- Full CI/CD pipeline
- Advanced observability stack
- OpenAPI-first development

---

## 25. Key System Invariants

These must always remain true:

- Every task belongs to exactly one project.
- Every task has a globally unique project-based task key.
- Project codes are immutable after creation.
- Every subtask belongs to the same project as its parent.
- No task hierarchy deeper than one level is allowed.
- No orphan subtasks are allowed.
- Dependency graph must remain acyclic.
- Dependencies cannot cross project boundaries.
- A parent task cannot be DONE unless all subtasks are DONE.
- If a DONE parent has a subtask reopened, the parent must reopen automatically.
- BLOCKED is computed from dependencies, not stored as a status.
- A task is overdue when `deadline < today` AND status is not final.
- Users cannot access projects unless they are project members or admins.
- Task assignees and collaborators must be active project members.
- Soft-deleted tasks are hidden from all normal queries.
- Activity logs are never deleted.
- Optimistic locking prevents silent overwrite of task updates.
- Only admins can create users.
- Users with `must_reset_password = true` cannot access the main application.
- Inactive and soft-deleted users cannot log in.
- All authentication endpoints are rate-limited.
- Production must not use wildcard CORS.
- Production must use secure session and CSRF cookie settings.
- Comments are permanently immutable — no edit or delete path exists.
- The first admin is created only via the bootstrap management command.
- Sessions expire after 8 hours.
