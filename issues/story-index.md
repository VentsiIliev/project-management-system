# Story Index

| Story | Title | Area | Wave | Depends on |
| --- | --- | --- | --- | --- |
| [US-001](stories/us-001-user-login.md) | User Login | 1. Authentication and Session Management | Wave 0 | None |
| [US-002](stories/us-002-forced-first-login-password-reset.md) | Forced First-Login Password Reset | 1. Authentication and Session Management | Wave 1 | US-001 |
| [US-003](stories/us-003-logout.md) | Logout | 1. Authentication and Session Management | Wave 1 | US-001 |
| [US-004](stories/us-004-session-expiration.md) | Session Expiration | 1. Authentication and Session Management | Wave 1 | US-001 |
| [US-005](stories/us-005-create-user.md) | Create User | 2. Admin User Management | Wave 0 | US-001 |
| [US-006](stories/us-006-update-user.md) | Update User | 2. Admin User Management | Wave 1 | US-005 |
| [US-007](stories/us-007-reset-user-password.md) | Reset User Password | 2. Admin User Management | Wave 1 | US-005 |
| [US-008](stories/us-008-deactivate-user.md) | Deactivate User | 2. Admin User Management | Wave 1 | US-005 |
| [US-009](stories/us-009-create-project.md) | Create Project | 3. Projects | Wave 0 | US-001 |
| [US-010](stories/us-010-immutable-project-code.md) | Immutable Project Code | 3. Projects | Wave 2 | US-009 |
| [US-011](stories/us-011-view-project.md) | View Project | 3. Projects | Wave 2 | US-009 |
| [US-012](stories/us-012-edit-project.md) | Edit Project | 3. Projects | Wave 2 | US-009, US-011 |
| [US-013](stories/us-013-delete-project-with-confirmation.md) | Delete Project With Confirmation | 3. Projects | Wave 2 | US-009, US-011 |
| [US-014](stories/us-014-add-project-member.md) | Add Project Member | 4. Project Memberships and Roles | Wave 2 | US-009, US-005 |
| [US-015](stories/us-015-change-project-member-role.md) | Change Project Member Role | 4. Project Memberships and Roles | Wave 2 | US-014 |
| [US-016](stories/us-016-remove-project-member.md) | Remove Project Member | 4. Project Memberships and Roles | Wave 2 | US-014 |
| [US-017](stories/us-017-create-task.md) | Create Task | 5. Task Management | Wave 0 | US-009, US-014 |
| [US-018](stories/us-018-atomic-task-numbering.md) | Atomic Task Numbering | 5. Task Management | Wave 3 | US-017 |
| [US-019](stories/us-019-view-task.md) | View Task | 5. Task Management | Wave 3 | US-017 |
| [US-020](stories/us-020-update-task-planning-fields.md) | Update Task Planning Fields | 5. Task Management | Wave 3 | US-017 |
| [US-021](stories/us-021-team-member-updates-task-description.md) | Team Member Updates Task Description | 5. Task Management | Wave 3 | US-017, US-014 |
| [US-022](stories/us-022-delete-task.md) | Delete Task | 5. Task Management | Wave 3 | US-017 |
| [US-023](stories/us-023-create-subtask.md) | Create Subtask | 6. Subtasks | Wave 3 | US-017 |
| [US-024](stories/us-024-parent-completion-requires-completed-subtasks.md) | Parent Completion Requires Completed Subtasks | 6. Subtasks | Wave 3 | US-023, US-026 |
| [US-025](stories/us-025-reopen-parent-when-subtask-reopens.md) | Reopen Parent When Subtask Reopens | 6. Subtasks | Wave 3 | US-023, US-026 |
| [US-026](stories/us-026-change-task-status.md) | Change Task Status | 7. Statuses and Workflow | Wave 3 | US-017, US-028 |
| [US-027](stories/us-027-prevent-blocked-task-progression.md) | Prevent Blocked Task Progression | 7. Statuses and Workflow | Unassigned | US-026, US-029, US-031 |
| [US-028](stories/us-028-database-driven-statuses.md) | Database-Driven Statuses | 7. Statuses and Workflow | Wave 0 | US-017 |
| [US-029](stories/us-029-add-dependency.md) | Add Dependency | 8. Dependencies and Blocking | Wave 4 | US-017, US-030, US-069 |
| [US-030](stories/us-030-prevent-circular-dependencies.md) | Prevent Circular Dependencies | 8. Dependencies and Blocking | Wave 4 | US-017 |
| [US-031](stories/us-031-compute-blocked-state.md) | Compute Blocked State | 8. Dependencies and Blocking | Wave 4 | US-029, US-026 |
| [US-032](stories/us-032-remove-dependency.md) | Remove Dependency | 8. Dependencies and Blocking | Wave 4 | US-029 |
| [US-033](stories/us-033-add-comment.md) | Add Comment | 9. Comments and Real-Time Updates | Wave 4 | US-019, US-001 |
| [US-034](stories/us-034-immutable-comments.md) | Immutable Comments | 9. Comments and Real-Time Updates | Wave 4 | US-033 |
| [US-035](stories/us-035-real-time-comment-broadcast.md) | Real-Time Comment Broadcast | 9. Comments and Real-Time Updates | Wave 4 | US-033 |
| [US-036](stories/us-036-websocket-reconnection.md) | WebSocket Reconnection | 9. Comments and Real-Time Updates | Wave 4 | US-035 |
| [US-037](stories/us-037-receive-task-notifications.md) | Receive Task Notifications | 10. Notifications | Wave 4 | US-017, US-040 |
| [US-038](stories/us-038-view-notifications.md) | View Notifications | 10. Notifications | Wave 4 | US-037 |
| [US-039](stories/us-039-mark-notifications-read.md) | Mark Notifications Read | 10. Notifications | Wave 4 | US-038 |
| [US-040](stories/us-040-record-task-activity.md) | Record Task Activity | 11. Activity Logs | Wave 4 | US-017 |
| [US-041](stories/us-041-view-task-activity.md) | View Task Activity | 11. Activity Logs | Wave 4 | US-040, US-019 |
| [US-042](stories/us-042-view-project-activity.md) | View Project Activity | 11. Activity Logs | Wave 2 | US-009, US-040 |
| [US-043](stories/us-043-search-project-tasks.md) | Search Project Tasks | 12. Search, Filtering, and Pagination | Wave 5 | US-017, US-045 |
| [US-044](stories/us-044-filter-project-tasks.md) | Filter Project Tasks | 12. Search, Filtering, and Pagination | Wave 5 | US-017, US-045 |
| [US-045](stories/us-045-paginated-lists.md) | Paginated Lists | 12. Search, Filtering, and Pagination | Wave 5 | US-011, US-019 |
| [US-046](stories/us-046-view-kanban-board.md) | View Kanban Board | 13. Kanban Board | Wave 5 | US-017, US-026, US-045 |
| [US-047](stories/us-047-drag-task-between-kanban-columns.md) | Drag Task Between Kanban Columns | 13. Kanban Board | Wave 5 | US-046, US-026, US-027 |
| [US-048](stories/us-048-view-gantt-timeline.md) | View Gantt Timeline | 14. Gantt Chart | Wave 5 | US-017, US-045 |
| [US-049](stories/us-049-read-only-gantt-interaction.md) | Read-Only Gantt Interaction | 14. Gantt Chart | Wave 5 | US-048 |
| [US-050](stories/us-050-gantt-conflict-warning.md) | Gantt Conflict Warning | 14. Gantt Chart | Wave 5 | US-048, US-071 |
| [US-051](stories/us-051-view-my-assigned-tasks.md) | View My Assigned Tasks | 15. My Tasks | Wave 5 | US-017, US-045 |
| [US-052](stories/us-052-sort-my-tasks.md) | Sort My Tasks | 15. My Tasks | Wave 5 | US-051 |
| [US-053](stories/us-053-use-database-driven-priorities.md) | Use Database-Driven Priorities | 16. Priorities and Metadata | Wave 0 | US-017 |
| [US-054](stories/us-054-view-workflow-metadata.md) | View Workflow Metadata | 16. Priorities and Metadata | Wave 5 | US-028, US-053 |
| [US-055](stories/us-055-enforce-backend-authorization.md) | Enforce Backend Authorization | 17. Authorization and Security | Wave 0 | US-001 |
| [US-056](stories/us-056-admin-override-with-invariants.md) | Admin Override With Invariants | 17. Authorization and Security | Wave 6 | US-055 |
| [US-057](stories/us-057-csrf-protection.md) | CSRF Protection | 17. Authorization and Security | Wave 1 | US-001 |
| [US-058](stories/us-058-rate-limit-authentication-endpoints.md) | Rate-Limit Authentication Endpoints | 17. Authorization and Security | Wave 1 | US-001 |
| [US-059](stories/us-059-handle-optimistic-lock-conflict.md) | Handle Optimistic Lock Conflict | 18. Frontend Error and State Handling | Wave 5 | US-020, US-026 |
| [US-060](stories/us-060-handle-loading-empty-and-error-states.md) | Handle Loading, Empty, and Error States | 18. Frontend Error and State Handling | Wave 5 | US-011, US-019 |
| [US-061](stories/us-061-hide-soft-deleted-tasks.md) | Hide Soft-Deleted Tasks | 19. Soft Deletion and Data Preservation | Wave 5 | US-022 |
| [US-062](stories/us-062-preserve-historical-references.md) | Preserve Historical References | 19. Soft Deletion and Data Preservation | Wave 5 | US-061, US-040 |
| [US-063](stories/us-063-daily-database-backup.md) | Daily Database Backup | 20. Backup, Recovery, and Operations | Wave 6 | US-001 |
| [US-064](stories/us-064-redis-recovery-behavior.md) | Redis Recovery Behavior | 20. Backup, Recovery, and Operations | Wave 6 | US-035 |
| [US-065](stories/us-065-no-public-registration.md) | No Public Registration | 21. MVP Boundary Stories | Wave 1 | US-001 |
| [US-066](stories/us-066-no-email-notifications-in-mvp.md) | No Email Notifications in MVP | 21. MVP Boundary Stories | Wave 6 | US-037 |
| [US-067](stories/us-067-no-attachments-in-mvp.md) | No Attachments in MVP | 21. MVP Boundary Stories | Wave 6 | US-033 |
| [US-068](stories/us-068-no-cross-project-dependencies.md) | No Cross-Project Dependencies | 21. MVP Boundary Stories | Wave 4 | US-029 |
| [US-069](stories/us-069-enforce-task-project-ownership.md) | Enforce Task-Project Ownership | 22. Key Invariant Coverage | Wave 3 | US-017 |
| [US-070](stories/us-070-enforce-active-project-members-for-assignments.md) | Enforce Active Project Members for Assignments | 22. Key Invariant Coverage | Wave 3 | US-014, US-017 |
| [US-071](stories/us-071-enforce-overdue-definition.md) | Enforce Overdue Definition | 22. Key Invariant Coverage | Wave 3 | US-020, US-026 |
| [US-072](stories/us-072-enforce-comment-permanence.md) | Enforce Comment Permanence | 22. Key Invariant Coverage | Wave 4 | US-033 |
