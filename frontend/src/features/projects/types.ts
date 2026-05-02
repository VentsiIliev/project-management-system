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

export type TaskStatus = {
  name: string;
};

export type TaskAssignee = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  task_key: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  primary_assignee: TaskAssignee | null;
  start_date: string | null;
  deadline: string | null;
  version: number;
  created_at: string;
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
  start_date?: string | null;
  deadline?: string | null;
  primary_assignee_id?: string | null;
};
