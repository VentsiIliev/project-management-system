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
