import { apiRequest } from "../../../api/client";
import { type CreateProjectRequest, type Project, type ProjectDetail, type UpdateProjectRequest } from "../types";


export async function createProject(payload: CreateProjectRequest): Promise<Project> {
  const response = await apiRequest<{ project: Project }>("/projects", {
    body: JSON.stringify(payload),
    method: "POST",
  });

  return response.project;
}

export async function getProjects(): Promise<Project[]> {
  const response = await apiRequest<{ projects: Project[] }>("/projects");
  return response.projects;
}

export async function getProject(projectId: string): Promise<ProjectDetail> {
  const response = await apiRequest<{ project: ProjectDetail }>(`/projects/${projectId}`);
  return response.project;
}

export async function updateProject(
  projectId: string,
  payload: UpdateProjectRequest,
): Promise<ProjectDetail> {
  const response = await apiRequest<{ project: ProjectDetail }>(`/projects/${projectId}`, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });

  return response.project;
}
