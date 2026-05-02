import { apiRequest } from "../../../api/client";
import {
  type AddProjectMemberRequest,
  type CreateProjectRequest,
  type DeleteProjectRequest,
  type ProjectMember,
  type Project,
  type ProjectDetail,
  type UpdateProjectRequest,
} from "../types";


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

export async function deleteProject(projectId: string, payload: DeleteProjectRequest): Promise<void> {
  await apiRequest(`/projects/${projectId}`, {
    body: JSON.stringify(payload),
    method: "DELETE",
  });
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const response = await apiRequest<{ members: ProjectMember[] }>(`/projects/${projectId}/members`);
  return response.members;
}

export async function addProjectMember(
  projectId: string,
  payload: AddProjectMemberRequest,
): Promise<ProjectMember> {
  const response = await apiRequest<{ member: ProjectMember }>(`/projects/${projectId}/members`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response.member;
}
