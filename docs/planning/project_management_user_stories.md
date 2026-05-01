# Project Management App — User Stories

Source: Engineering Specification v4

## Format

Each story follows:

- **As a** [role]
- **I want** [capability]
- **So that** [benefit]
- **Acceptance Criteria** using **Given / When / Then**

---

# 1. Authentication and Session Management

## US-001 — User Login

**As a** user  
**I want** to log in with my email and password  
**So that** I can access the project management application.

### Acceptance Criteria

**Given** I am an active, non-deleted user  
**When** I submit valid email and password credentials  
**Then** the system creates a session and returns my user profile.

**Given** my credentials are invalid  
**When** I attempt to log in  
**Then** the system returns a generic invalid credentials error.

**Given** my account is inactive or soft-deleted  
**When** I attempt to log in  
**Then** the system returns a generic invalid credentials error.

**Given** I am required to reset my password  
**When** I log in successfully  
**Then** the response indicates that password reset is required.

---

## US-002 — Forced First-Login Password Reset

**As a** newly created user  
**I want** to reset my temporary password on first login  
**So that** only I know my long-term password.

### Acceptance Criteria

**Given** my account has `must_reset_password = true`  
**When** I log in successfully  
**Then** I am redirected to the password reset screen.

**Given** I am on the forced password reset screen  
**When** I submit a valid new password  
**Then** the system updates my password and sets `must_reset_password = false`.

**Given** I have not completed the forced password reset  
**When** I attempt to access any main application page  
**Then** the system blocks access and redirects me back to password reset.

---

## US-003 — Logout

**As a** user  
**I want** to log out  
**So that** my session is ended securely.

### Acceptance Criteria

**Given** I am authenticated  
**When** I log out  
**Then** the system invalidates my current session.

**Given** I have logged out  
**When** I attempt to access a protected page  
**Then** I am redirected to login.

---

## US-004 — Session Expiration

**As a** user  
**I want** inactive sessions to expire  
**So that** my account is protected when I stop using the app.

### Acceptance Criteria

**Given** I have been inactive for 8 hours  
**When** I make another authenticated request  
**Then** the system treats me as unauthenticated.

**Given** I continue using the application  
**When** I make authenticated requests  
**Then** my session inactivity timer is refreshed.

---

# 2. Admin User Management

## US-005 — Create User

**As an** Admin  
**I want** to create user accounts  
**So that** employees can access the system.

### Acceptance Criteria

**Given** I am an Admin  
**When** I create a user with name, unique email, and valid temporary password  
**Then** the system creates an active user with `must_reset_password = true`.

**Given** the email is already used  
**When** I attempt to create the user  
**Then** the system rejects the request with a validation error.

**Given** I am not an Admin  
**When** I attempt to create a user  
**Then** the system denies permission.

---

## US-006 — Update User

**As an** Admin  
**I want** to update user profile and active status  
**So that** user records remain accurate.

### Acceptance Criteria

**Given** I am an Admin  
**When** I update a user name, email, or active status  
**Then** the system saves the allowed changes.

**Given** I attempt to update unsupported fields  
**When** I submit the request  
**Then** the system rejects unsupported changes.

---

## US-007 — Reset User Password

**As an** Admin  
**I want** to reset a user's password  
**So that** the user can recover access.

### Acceptance Criteria

**Given** I am an Admin  
**When** I set a valid temporary password for a user  
**Then** the system updates the password and sets `must_reset_password = true`.

**Given** the temporary password violates password policy  
**When** I submit the reset request  
**Then** the system rejects the request.

---

## US-008 — Deactivate User

**As an** Admin  
**I want** to deactivate users  
**So that** they can no longer access the system.

### Acceptance Criteria

**Given** I am an Admin  
**When** I deactivate a user  
**Then** the user can no longer create new sessions.

**Given** the deactivated user has existing assignments  
**When** tasks are viewed  
**Then** historical assignments remain visible.

---

# 3. Projects

## US-009 — Create Project

**As an** Admin or Project Manager  
**I want** to create projects  
**So that** teams can organize work.

### Acceptance Criteria

**Given** I have permission to create projects  
**When** I provide a project name, unique code, and optional dates  
**Then** the system creates the project.

**Given** the end date is earlier than the start date  
**When** I submit the project  
**Then** the system rejects the request.

**Given** I am a Team Member  
**When** I attempt to create a project  
**Then** the system denies permission.

---

## US-010 — Immutable Project Code

**As a** system  
**I want** project codes to remain immutable  
**So that** task keys remain stable forever.

### Acceptance Criteria

**Given** a project already exists  
**When** a user attempts to update the project code  
**Then** the system rejects the request with `PROJECT_CODE_IMMUTABLE`.

---

## US-011 — View Project

**As a** project member  
**I want** to view projects I belong to  
**So that** I can access project work.

### Acceptance Criteria

**Given** I am a project member  
**When** I open the project  
**Then** I can view project details.

**Given** I am not a project member and not an Admin  
**When** I attempt to view the project  
**Then** the system denies access or hides the project.

---

## US-012 — Edit Project

**As an** Admin or Project Manager  
**I want** to edit project details  
**So that** project information stays current.

### Acceptance Criteria

**Given** I am an Admin or Project Manager  
**When** I update editable project fields  
**Then** the system saves the changes.

**Given** I am a Team Member  
**When** I attempt to edit project details  
**Then** the system denies permission.

---

## US-013 — Delete Project With Confirmation

**As an** Admin or Project Manager  
**I want** to delete a project only after confirmation  
**So that** accidental project deletion is prevented.

### Acceptance Criteria

**Given** I have permission to delete a project  
**When** I submit a delete request without confirmation  
**Then** the system rejects the request.

**Given** I confirm project deletion  
**When** I delete the project  
**Then** the system soft-deletes the project, tasks, subtasks, and memberships.

**Given** a project is soft-deleted  
**When** normal users search or browse projects and tasks  
**Then** the deleted project and related work are hidden.

**Given** a project is deleted  
**When** activity logs are viewed through admin/debug tooling  
**Then** historical activity remains preserved.

---

# 4. Project Memberships and Roles

## US-014 — Add Project Member

**As an** Admin or Project Manager  
**I want** to add users to projects  
**So that** they can collaborate on project work.

### Acceptance Criteria

**Given** I have permission to manage members  
**When** I add an active user with a valid project role  
**Then** the user becomes a project member.

**Given** the role is not `PROJECT_MANAGER` or `TEAM_MEMBER`  
**When** I submit the request  
**Then** the system rejects the request.

---

## US-015 — Change Project Member Role

**As an** Admin or Project Manager  
**I want** to change a member's project role  
**So that** responsibilities can be updated.

### Acceptance Criteria

**Given** I have permission to manage members  
**When** I update a member role  
**Then** the new role applies to project permissions.

---

## US-016 — Remove Project Member

**As an** Admin or Project Manager  
**I want** to remove members from projects  
**So that** access can be revoked.

### Acceptance Criteria

**Given** I remove a project member  
**When** the removal succeeds  
**Then** the membership is soft-deleted.

**Given** the removed user was assigned to tasks  
**When** those tasks are viewed  
**Then** the assignment remains visible and is labeled as removed from project.

**Given** a removed member attempts to access the project  
**When** they open project pages or APIs  
**Then** the system denies access.

---

# 5. Task Management

## US-017 — Create Task

**As an** Admin or Project Manager  
**I want** to create tasks  
**So that** project work can be tracked.

### Acceptance Criteria

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

---

## US-018 — Atomic Task Numbering

**As a** system  
**I want** task numbers to be generated atomically per project  
**So that** duplicate task keys are never created.

### Acceptance Criteria

**Given** two users create tasks in the same project at the same time  
**When** both requests are processed  
**Then** each task receives a unique sequential task number.

---

## US-019 — View Task

**As a** project member  
**I want** to view task details  
**So that** I can understand the work.

### Acceptance Criteria

**Given** I have access to the task's project  
**When** I open the task  
**Then** I can see title, description, status, priority, assignee, collaborators, dates, dependencies, subtasks, blocked state, overdue state, and version.

**Given** I do not have access to the task's project  
**When** I attempt to open the task  
**Then** the system denies access.

---

## US-020 — Update Task Planning Fields

**As an** Admin or Project Manager  
**I want** to update task planning fields  
**So that** project plans stay accurate.

### Acceptance Criteria

**Given** I am an Admin or Project Manager  
**When** I update title, priority, dates, assignee, collaborators, or description with the current version  
**Then** the system saves the update and increments the task version.

**Given** I submit an outdated task version  
**When** I update the task  
**Then** the system rejects the request with `OPTIMISTIC_LOCK_FAILED`.

---

## US-021 — Team Member Updates Task Description

**As a** Team Member  
**I want** to update task descriptions  
**So that** I can add execution details.

### Acceptance Criteria

**Given** I am a Team Member on the project  
**When** I update only the task description with the current version  
**Then** the system saves the change.

**Given** I am a Team Member  
**When** I attempt to update planning fields  
**Then** the system denies permission.

---

## US-022 — Delete Task

**As an** Admin or Project Manager  
**I want** to delete tasks  
**So that** obsolete work is hidden from normal workflows.

### Acceptance Criteria

**Given** I have permission to delete tasks  
**When** I delete a task without subtasks  
**Then** the system soft-deletes the task.

**Given** the task has subtasks  
**When** I delete it without cascade confirmation  
**Then** the system rejects the request.

**Given** the task has subtasks and I confirm cascade deletion  
**When** I delete the parent task  
**Then** the system soft-deletes the parent task and its subtasks.

**Given** I am a Team Member  
**When** I attempt to delete a task  
**Then** the system denies permission.

---

# 6. Subtasks

## US-023 — Create Subtask

**As an** Admin or Project Manager  
**I want** to create subtasks  
**So that** large tasks can be broken into smaller pieces.

### Acceptance Criteria

**Given** I have permission to create subtasks  
**When** I create a task with a valid parent task in the same project  
**Then** the system creates a one-level subtask.

**Given** the parent task belongs to another project  
**When** I create the subtask  
**Then** the system rejects the request.

**Given** the parent task is already a subtask  
**When** I attempt to create another child under it  
**Then** the system rejects the request with `INVALID_HIERARCHY`.

---

## US-024 — Parent Completion Requires Completed Subtasks

**As a** user  
**I want** parent tasks to require completed subtasks before completion  
**So that** parent progress accurately reflects child work.

### Acceptance Criteria

**Given** a parent task has incomplete subtasks  
**When** I attempt to move the parent to DONE  
**Then** the system rejects the transition with `SUBTASKS_INCOMPLETE`.

**Given** all subtasks are DONE  
**When** I move the parent task to DONE  
**Then** the system allows the transition if all other rules pass.

---

## US-025 — Reopen Parent When Subtask Reopens

**As a** system  
**I want** to reopen a completed parent task when a subtask is reopened  
**So that** task status remains consistent.

### Acceptance Criteria

**Given** a parent task is DONE  
**And** one of its subtasks is DONE  
**When** the subtask is changed to a non-final status  
**Then** the system automatically reopens the parent task.

**Given** the parent is reopened automatically  
**When** the action is completed  
**Then** the system records a `PARENT_REOPENED` activity log entry.

---

# 7. Statuses and Workflow

## US-026 — Change Task Status

**As a** project member  
**I want** to change task status  
**So that** task progress is visible.

### Acceptance Criteria

**Given** I have permission to change status  
**When** I submit a valid status transition with the current version  
**Then** the system updates the status and increments the version.

**Given** the transition is not allowed  
**When** I submit the status change  
**Then** the system rejects the request with `INVALID_STATUS_TRANSITION`.

---

## US-027 — Prevent Blocked Task Progression

**As a** system  
**I want** blocked tasks to be prevented from moving forward  
**So that** dependency rules are enforced.

### Acceptance Criteria

**Given** a task has at least one incomplete dependency  
**When** a user attempts to move the task to IN_PROGRESS or DONE  
**Then** the system rejects the transition with `TASK_BLOCKED`.

**Given** a task is already IN_PROGRESS and later becomes blocked  
**When** users view the task  
**Then** it remains IN_PROGRESS but shows a blocked indicator.

---

## US-028 — Database-Driven Statuses

**As an** Admin  
**I want** task statuses to be database-driven  
**So that** workflow metadata can evolve over time.

### Acceptance Criteria

**Given** a status is active  
**When** Kanban is rendered  
**Then** the status appears as a column ordered by `sort_order`.

**Given** a status is inactive  
**When** Kanban is rendered  
**Then** the column still appears and is visually marked inactive.

**Given** a status is inactive  
**When** a user attempts to drop a task into that column  
**Then** the move is rejected.

---

# 8. Dependencies and Blocking

## US-029 — Add Dependency

**As an** Admin or Project Manager  
**I want** to add dependencies between tasks  
**So that** blocked work is tracked.

### Acceptance Criteria

**Given** I have permission to manage dependencies  
**When** I add a dependency between two tasks in the same project  
**Then** the system records the dependency.

**Given** the tasks belong to different projects  
**When** I add the dependency  
**Then** the system rejects the request with `CROSS_PROJECT_DEPENDENCY`.

**Given** the dependency already exists  
**When** I add the same dependency again  
**Then** the system rejects the request with `DUPLICATE_DEPENDENCY`.

**Given** the dependency points a task to itself  
**When** I submit the request  
**Then** the system rejects it.

---

## US-030 — Prevent Circular Dependencies

**As a** system  
**I want** to prevent circular dependencies  
**So that** the dependency graph stays valid.

### Acceptance Criteria

**Given** adding a dependency would create a cycle  
**When** the request is processed  
**Then** the system rejects it with `DEPENDENCY_CYCLE`.

**Given** concurrent dependency requests are submitted  
**When** one would result in a cycle  
**Then** the system rejects the unsafe transaction.

---

## US-031 — Compute Blocked State

**As a** user  
**I want** blocked state to be computed automatically  
**So that** task status remains accurate.

### Acceptance Criteria

**Given** a task depends on another task that is not final  
**When** I view the task  
**Then** the task shows as blocked.

**Given** all dependencies are final  
**When** I view the task  
**Then** the task does not show as blocked.

**Given** a task has no dependencies  
**When** I view the task  
**Then** the task does not show as blocked.

---

## US-032 — Remove Dependency

**As an** Admin or Project Manager  
**I want** to remove task dependencies  
**So that** outdated blockers can be cleared.

### Acceptance Criteria

**Given** I have permission to manage dependencies  
**When** I remove a dependency  
**Then** the dependency is deleted and blocking state is recalculated.

---

# 9. Comments and Real-Time Updates

## US-033 — Add Comment

**As a** project member  
**I want** to comment on tasks  
**So that** I can collaborate with teammates.

### Acceptance Criteria

**Given** I have access to the task  
**When** I submit a non-empty comment  
**Then** the system saves the comment.

**Given** the comment is empty  
**When** I submit it  
**Then** the system rejects the request.

**Given** a comment is created  
**When** the action succeeds  
**Then** the system creates activity and notification events.

---

## US-034 — Immutable Comments

**As a** system  
**I want** comments to be immutable  
**So that** discussion history is preserved.

### Acceptance Criteria

**Given** a comment exists  
**When** a user attempts to edit or delete it  
**Then** no edit or delete endpoint is available.

---

## US-035 — Real-Time Comment Broadcast

**As a** project member viewing a task  
**I want** new comments to appear instantly  
**So that** collaboration feels live.

### Acceptance Criteria

**Given** I am connected to the task comment WebSocket  
**When** another authorized user posts a comment  
**Then** I receive the comment event in real time.

**Given** I do not have access to the task  
**When** I attempt to connect to the task comment WebSocket  
**Then** the connection is rejected.

---

## US-036 — WebSocket Reconnection

**As a** user  
**I want** the app to reconnect when comment updates disconnect  
**So that** I do not miss conversation updates.

### Acceptance Criteria

**Given** the WebSocket connection drops  
**When** the frontend detects the disconnection  
**Then** it shows a subtle reconnecting indicator.

**Given** reconnect attempts are needed  
**When** the frontend retries  
**Then** it uses exponential backoff up to 30 seconds.

**Given** the connection is restored  
**When** reconnection succeeds  
**Then** the frontend fetches missed comments since the last received comment.

---

# 10. Notifications

## US-037 — Receive Task Notifications

**As a** relevant task participant  
**I want** to receive in-app notifications  
**So that** I know when task activity affects me.

### Acceptance Criteria

**Given** a task event occurs  
**When** I am the assignee, collaborator, creator, or previous commenter  
**Then** I receive a notification unless I performed the action myself.

**Given** I am a removed project member  
**When** task activity occurs  
**Then** I do not receive project notifications.

---

## US-038 — View Notifications

**As a** user  
**I want** to view notifications newest first  
**So that** I can catch up on recent activity.

### Acceptance Criteria

**Given** I open notifications  
**When** notifications are loaded  
**Then** they are shown newest first with pagination.

**Given** I have unread notifications  
**When** notifications are displayed  
**Then** unread notifications have a visible unread indicator.

**Given** I have no notifications  
**When** I open the notification list  
**Then** an empty state is displayed.

---

## US-039 — Mark Notifications Read

**As a** user  
**I want** to mark notifications as read  
**So that** I can manage my notification state.

### Acceptance Criteria

**Given** I have an unread notification  
**When** I mark it as read  
**Then** the notification becomes read.

**Given** I have multiple unread notifications  
**When** I mark all as read  
**Then** all my notifications become read.

---

# 11. Activity Logs

## US-040 — Record Task Activity

**As a** user  
**I want** task history to be recorded  
**So that** important changes are auditable.

### Acceptance Criteria

**Given** a tracked task event occurs  
**When** the action completes  
**Then** the system creates an activity log entry.

**Given** a task is soft-deleted  
**When** its history is inspected  
**Then** related activity logs remain preserved.

---

## US-041 — View Task Activity

**As a** project member  
**I want** to view task activity  
**So that** I can understand what changed over time.

### Acceptance Criteria

**Given** I have access to the task  
**When** I open task activity  
**Then** I can view activity log entries for that task.

**Given** I do not have task access  
**When** I attempt to view task activity  
**Then** the system denies access.

---

## US-042 — View Project Activity

**As an** Admin or project member  
**I want** to view project activity  
**So that** I can audit important project-level changes.

### Acceptance Criteria

**Given** I have access to the project  
**When** I open project activity  
**Then** I can view relevant project activity entries.

---

# 12. Search, Filtering, and Pagination

## US-043 — Search Project Tasks

**As a** project member  
**I want** to search tasks within a project  
**So that** I can quickly find work items.

### Acceptance Criteria

**Given** I have project access  
**When** I search by title, description, or task key  
**Then** the system returns matching non-deleted tasks from that project.

**Given** matching tasks exist in another project I cannot access  
**When** I search  
**Then** those tasks are not returned.

---

## US-044 — Filter Project Tasks

**As a** project member  
**I want** to filter tasks  
**So that** I can focus on relevant work.

### Acceptance Criteria

**Given** I have project access  
**When** I filter by status, priority, assignee, deadline range, or blocked state  
**Then** the system returns matching tasks.

**Given** search and filters are combined  
**When** I submit the query  
**Then** both search and filter criteria are applied.

---

## US-045 — Paginated Lists

**As a** user  
**I want** list results to be paginated  
**So that** large datasets remain usable.

### Acceptance Criteria

**Given** I request a list endpoint  
**When** the response is returned  
**Then** the response includes results and pagination metadata.

**Given** I request a specific page and page size  
**When** results are returned  
**Then** the system respects those pagination parameters.

---

# 13. Kanban Board

## US-046 — View Kanban Board

**As a** project member  
**I want** to view tasks on a Kanban board  
**So that** I can understand workflow status visually.

### Acceptance Criteria

**Given** I open a project Kanban board  
**When** tasks are loaded  
**Then** columns are ordered by status sort order.

**Given** tasks exist in each status  
**When** the board renders  
**Then** task cards are grouped by status.

**Given** a task is blocked or overdue  
**When** the task card renders  
**Then** the appropriate indicator is shown.

---

## US-047 — Drag Task Between Kanban Columns

**As a** project member  
**I want** to drag tasks between valid Kanban columns  
**So that** I can update task progress quickly.

### Acceptance Criteria

**Given** I drag a task to a valid active status column  
**When** the drop succeeds  
**Then** the frontend calls the status endpoint.

**Given** the status update succeeds  
**When** the response is returned  
**Then** the card remains in the new column.

**Given** the transition is invalid, blocked, or violates parent/subtask rules  
**When** I drop the card  
**Then** the move is rejected and the card snaps back.

**Given** the target status is inactive  
**When** I drop the card there  
**Then** the move is rejected.

---

# 14. Gantt Chart

## US-048 — View Gantt Timeline

**As a** project member  
**I want** to view tasks on a Gantt chart  
**So that** I can understand schedules and dependencies.

### Acceptance Criteria

**Given** tasks have start dates and deadlines  
**When** I open the Gantt chart  
**Then** task timelines are displayed from start date to deadline.

**Given** dependencies exist  
**When** the Gantt chart renders  
**Then** dependency links are displayed.

**Given** subtasks exist  
**When** the Gantt chart renders  
**Then** subtasks are grouped under their parent tasks.

---

## US-049 — Read-Only Gantt Interaction

**As a** project member  
**I want** the MVP Gantt chart to be read-only  
**So that** schedule edits remain controlled through task forms.

### Acceptance Criteria

**Given** I view the Gantt chart  
**When** I attempt to drag task dates  
**Then** date dragging is unavailable.

**Given** I click a task bar  
**When** the click is handled  
**Then** the task detail view opens.

---

## US-050 — Gantt Conflict Warning

**As a** project member  
**I want** dependency date conflicts to be highlighted  
**So that** I can manually resolve schedule issues.

### Acceptance Criteria

**Given** task B depends on task A  
**And** task B starts before task A's deadline  
**When** the Gantt chart renders  
**Then** the affected task and dependency link show a warning.

**Given** conflicting dates are saved  
**When** the backend validates the task  
**Then** the system allows the save and does not auto-adjust dates.

**Given** a conflict exists  
**When** the warning is displayed  
**Then** the message says: `Task starts before its dependency is completed.`

---

# 15. My Tasks

## US-051 — View My Assigned Tasks

**As a** user  
**I want** to view tasks assigned to me  
**So that** I can focus on my work.

### Acceptance Criteria

**Given** I am the primary assignee on tasks  
**When** I open My Tasks  
**Then** those tasks are listed.

**Given** I am a collaborator on tasks  
**When** collaborator tasks are enabled  
**Then** those tasks are also listed.

---

## US-052 — Sort My Tasks

**As a** user  
**I want** My Tasks sorted by deadline and priority  
**So that** I can prioritize work.

### Acceptance Criteria

**Given** I open My Tasks  
**When** tasks are displayed  
**Then** they can be sorted by deadline and priority.

**Given** a task is overdue or blocked  
**When** it appears in My Tasks  
**Then** the relevant indicator is shown.

---

# 16. Priorities and Metadata

## US-053 — Use Database-Driven Priorities

**As an** Admin  
**I want** priorities to be database-driven  
**So that** priority options can be configured.

### Acceptance Criteria

**Given** an active priority exists  
**When** a manager creates or updates a task  
**Then** the priority can be assigned.

**Given** a priority is inactive  
**When** a manager creates a new task  
**Then** the inactive priority cannot be assigned.

**Given** an existing task references an inactive priority  
**When** the task is viewed  
**Then** the inactive priority remains visible.

---

## US-054 — View Workflow Metadata

**As a** frontend application  
**I want** to retrieve statuses, transitions, and priorities  
**So that** the UI can render current workflow options.

### Acceptance Criteria

**Given** the frontend requests workflow metadata  
**When** the API responds  
**Then** statuses, transitions, and priorities are returned from the database.

---

# 17. Authorization and Security

## US-055 — Enforce Backend Authorization

**As a** system  
**I want** every API endpoint to enforce permissions server-side  
**So that** hidden frontend actions cannot bypass security.

### Acceptance Criteria

**Given** a user sends a request to any protected endpoint  
**When** the request is processed  
**Then** the backend verifies authentication, account status, project membership, role, and requested action.

**Given** frontend UI hides an action  
**When** a user calls the API directly  
**Then** backend permissions are still enforced.

---

## US-056 — Admin Override With Invariants

**As an** Admin  
**I want** broad access across the system  
**So that** I can manage projects and tasks.

### Acceptance Criteria

**Given** I am an Admin  
**When** I access projects or tasks  
**Then** I may bypass role restrictions.

**Given** I am an Admin  
**When** I attempt to create circular dependencies, cross-project dependencies, invalid task hierarchy, or invalid completion state  
**Then** the system still rejects the request.

---

## US-057 — CSRF Protection

**As a** system  
**I want** unsafe authenticated requests to require CSRF protection  
**So that** session-based authentication is protected.

### Acceptance Criteria

**Given** a user submits POST, PATCH, PUT, or DELETE  
**When** the CSRF token is missing or invalid  
**Then** the request is rejected.

**Given** the CSRF token is valid  
**When** the unsafe request is submitted  
**Then** normal authentication and authorization checks continue.

---

## US-058 — Rate-Limit Authentication Endpoints

**As a** system  
**I want** authentication endpoints to be rate-limited  
**So that** brute-force attempts are reduced.

### Acceptance Criteria

**Given** repeated failed login attempts occur from the same IP or email  
**When** the limit is exceeded  
**Then** the system rate-limits further attempts.

**Given** an authentication failure occurs  
**When** the error is returned  
**Then** the message does not reveal whether the email exists or account is inactive.

---

# 18. Frontend Error and State Handling

## US-059 — Handle Optimistic Lock Conflict

**As a** user  
**I want** to be told when another user changed a task first  
**So that** I do not overwrite their work.

### Acceptance Criteria

**Given** I submit a stale task version  
**When** the API returns `OPTIMISTIC_LOCK_FAILED`  
**Then** the frontend shows: `This task was changed by someone else. Please refresh and try again.`

**Given** the conflict occurs  
**When** the message is shown  
**Then** the frontend refreshes task data and allows manual retry.

---

## US-060 — Handle Loading, Empty, and Error States

**As a** user  
**I want** clear interface states  
**So that** I understand what is happening.

### Acceptance Criteria

**Given** data is loading  
**When** a page waits for API results  
**Then** a loading state is shown.

**Given** a list has no results  
**When** the response is returned  
**Then** an empty state is shown.

**Given** a validation, permission, network, conflict, or not-found error occurs  
**When** the frontend receives the error  
**Then** a clear user-facing state or message is displayed.

---

# 19. Soft Deletion and Data Preservation

## US-061 — Hide Soft-Deleted Tasks

**As a** user  
**I want** deleted tasks hidden from normal views  
**So that** active workflows stay clean.

### Acceptance Criteria

**Given** a task is soft-deleted  
**When** Kanban, Gantt, My Tasks, search, filters, or normal APIs are loaded  
**Then** the task is excluded.

---

## US-062 — Preserve Historical References

**As a** system  
**I want** historical references to remain available  
**So that** audit history remains understandable.

### Acceptance Criteria

**Given** a user, task, or project is soft-deleted  
**When** activity logs reference that entity  
**Then** the logs remain available and retain historical context.

---

# 20. Backup, Recovery, and Operations

## US-063 — Daily Database Backup

**As an** operator  
**I want** daily PostgreSQL backups  
**So that** durable data can be recovered.

### Acceptance Criteria

**Given** the system is in production  
**When** the backup schedule runs  
**Then** a PostgreSQL backup is created daily.

**Given** backups are created  
**When** retention is enforced  
**Then** backups are retained for at least 7 days.

---

## US-064 — Redis Recovery Behavior

**As a** user  
**I want** Redis loss to avoid durable data loss  
**So that** comments and tasks remain safe.

### Acceptance Criteria

**Given** Redis becomes unavailable  
**When** active WebSocket connections disconnect  
**Then** no durable business data is lost.

**Given** Redis is restored  
**When** clients reconnect  
**Then** users resume comment updates through the reconnection flow.

---

# 21. MVP Boundary Stories

## US-065 — No Public Registration

**As a** system owner  
**I want** user creation limited to Admins  
**So that** the internal app remains controlled.

### Acceptance Criteria

**Given** an unauthenticated person visits the app  
**When** they look for sign-up  
**Then** no public registration flow is available.

---

## US-066 — No Email Notifications in MVP

**As a** product owner  
**I want** notifications to be in-app only for MVP  
**So that** scope remains manageable.

### Acceptance Criteria

**Given** a task event occurs  
**When** notifications are created  
**Then** only in-app notifications are generated.

---

## US-067 — No Attachments in MVP

**As a** product owner  
**I want** file attachments excluded from MVP  
**So that** task scope remains focused.

### Acceptance Criteria

**Given** a user views or edits a task  
**When** they look for attachment functionality  
**Then** no attachment feature is available.

---

## US-068 — No Cross-Project Dependencies

**As a** system  
**I want** dependencies limited to the same project  
**So that** dependency management stays predictable.

### Acceptance Criteria

**Given** tasks are in different projects  
**When** a user attempts to create a dependency between them  
**Then** the system rejects the dependency.

---

# 22. Key Invariant Coverage

## US-069 — Enforce Task-Project Ownership

**As a** system  
**I want** every task to belong to exactly one project  
**So that** authorization, search, and task numbering remain consistent.

### Acceptance Criteria

**Given** a task is created  
**When** it is persisted  
**Then** it must have exactly one project.

---

## US-070 — Enforce Active Project Members for Assignments

**As a** system  
**I want** assignees and collaborators to be active project members  
**So that** tasks are assigned only to valid participants.

### Acceptance Criteria

**Given** a manager assigns a user to a task  
**When** the user is not an active project member  
**Then** the system rejects the assignment.

**Given** a collaborator is added  
**When** the user is not an active project member  
**Then** the system rejects the collaborator update.

---

## US-071 — Enforce Overdue Definition

**As a** user  
**I want** overdue tasks to be calculated consistently  
**So that** urgency is clear.

### Acceptance Criteria

**Given** a task deadline is before today  
**And** the task status is not final  
**When** the task is viewed  
**Then** the task is marked overdue.

**Given** a task has no deadline  
**When** the task is viewed  
**Then** the task is not overdue.

**Given** a task is in a final status  
**When** the task is viewed  
**Then** the task is not overdue even if the deadline is in the past.

---

## US-072 — Enforce Comment Permanence

**As a** system owner  
**I want** comments to remain permanent  
**So that** collaboration history is preserved.

### Acceptance Criteria

**Given** a comment has been created  
**When** users interact with the application  
**Then** there is no supported normal flow to edit or delete the comment.

---

# Traceability Summary

These user stories cover the major MVP areas:

- Authentication and password reset
- Admin user management
- Projects and memberships
- Roles and permissions
- Tasks, subtasks, dependencies, and workflow rules
- Kanban, Gantt, and My Tasks
- Comments, WebSockets, notifications, and activity logs
- Search, filtering, pagination, optimistic locking
- Security, session handling, CSRF, rate limiting
- Soft deletion, audit preservation, backup, and recovery
- MVP non-goals and key invariants
