import { apiRequest } from "../../../api/client";
import { type CreateProjectRequest, type Project } from "../types";


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

export async function getProject(projectId: string): Promise<Project> {
  const response = await apiRequest<{ project: Project }>(`/projects/${projectId}`);
  return response.project;
}
