export type Project = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  owner_id: string;
  task_counter: number;
  start_date: string | null;
  end_date: string | null;
};

export type ProjectDetail = Project & {
  can_edit: boolean;
  can_delete: boolean;
  can_manage_members: boolean;
};

export type ProjectMemberRole = "PROJECT_MANAGER" | "TEAM_MEMBER";

export type ProjectMember = {
  user_id: string;
  email: string;
  name: string;
  is_active: boolean;
  role: ProjectMemberRole;
};

export type ActivityEntry = {
  id: string;
  event_type: string;
  message: string;
  actor_name: string | null;
  project_code: string | null;
  project_name: string | null;
  task_key: string | null;
  task_title: string | null;
  related_user_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type Comment = {
  id: string;
  task_id: string;
  author: TaskAssignee;
  content: string;
  created_at: string;
};

export type Notification = {
  id: string;
  event_type: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type Pagination = {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export type TaskStatus = {
  id: string;
  name: string;
  sort_order: number;
  is_final: boolean;
  is_active: boolean;
  color: string | null;
};

export type TaskPriority = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  color: string | null;
};

export type TaskStatusTransition = {
  id: string;
  name: string | null;
  is_active: boolean;
  from_status_id: string;
  to_status_id: string;
};

export type TaskAssignee = {
  id: string;
  name: string;
};

export type TaskDependencySummary = {
  id: string;
  task_key: string;
  title: string;
  parent_task_id: string | null;
  status: TaskStatus;
  is_blocked: boolean;
};

export type Task = {
  id: string;
  task_key: string;
  project_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  primary_assignee: TaskAssignee | null;
  collaborators: TaskAssignee[];
  is_blocked: boolean;
  is_overdue: boolean;
  start_date: string | null;
  deadline: string | null;
  version: number;
  created_at: string;
  subtasks: Task[];
  dependencies: TaskDependencySummary[];
};

export type PaginatedTaskList = {
  tasks: Task[];
  pagination: Pagination;
};

export type ProjectTaskQueryParams = {
  search?: string;
  status_id?: string;
  priority_id?: string;
  assignee_id?: string;
  deadline_from?: string;
  deadline_to?: string;
  is_blocked?: boolean;
  page?: number;
  page_size?: number;
};

export type MyTaskQueryParams = {
  include_collaborator_tasks?: boolean;
  sort_by?: "deadline" | "priority";
  page?: number;
  page_size?: number;
};

export type CreateProjectRequest = {
  name: string;
  code: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
};

export type UpdateProjectRequest = {
  name?: string;
  code?: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type DeleteProjectRequest = {
  confirm_project_delete: boolean;
};

export type AddProjectMemberRequest = {
  user_id: string;
  role: ProjectMemberRole;
};

export type UpdateProjectMemberRequest = {
  role: ProjectMemberRole;
};

export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority_id?: string | null;
  start_date?: string | null;
  deadline?: string | null;
  primary_assignee_id?: string | null;
  parent_task_id?: string | null;
  collaborator_ids?: string[];
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string | null;
  priority_id?: string | null;
  start_date?: string | null;
  deadline?: string | null;
  primary_assignee_id?: string | null;
  collaborator_ids?: string[];
  version: number;
};

export type ChangeTaskStatusRequest = {
  to_status_id: string;
  version: number;
};

export type AddTaskDependencyRequest = {
  depends_on_task_id: string;
};

export type CreateCommentRequest = {
  content: string;
};

export type DeleteTaskRequest = {
  confirm_cascade_subtasks?: boolean;
};

export type WorkflowMetadata = {
  statuses: TaskStatus[];
  transitions: TaskStatusTransition[];
  priorities: TaskPriority[];
};
