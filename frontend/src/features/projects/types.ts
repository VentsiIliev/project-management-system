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
