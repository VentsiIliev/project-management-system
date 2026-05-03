import { apiRequest } from "../../../api/client";
import {
  type AddProjectMemberRequest,
  type ChangeTaskStatusRequest,
  type CreateTaskRequest,
  type CreateProjectRequest,
  type DeleteProjectRequest,
  type ProjectMember,
  type Project,
  type ProjectDetail,
  type Task,
  type UpdateTaskRequest,
  type UpdateProjectMemberRequest,
  type UpdateProjectRequest,
  type WorkflowMetadata,
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

export async function updateProjectMember(
  projectId: string,
  userId: string,
  payload: UpdateProjectMemberRequest,
): Promise<ProjectMember> {
  const response = await apiRequest<{ member: ProjectMember }>(
    `/projects/${projectId}/members/${userId}`,
    {
      body: JSON.stringify(payload),
      method: "PATCH",
    },
  );
  return response.member;
}

export async function removeProjectMember(projectId: string, userId: string): Promise<void> {
  await apiRequest(`/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const response = await apiRequest<{ tasks: Task[] }>(`/projects/${projectId}/tasks`);
  return response.tasks;
}

export async function createProjectTask(
  projectId: string,
  payload: CreateTaskRequest,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(`/projects/${projectId}/tasks`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response.task;
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(`/tasks/${taskId}`);
  return response.task;
}

export async function updateTask(taskId: string, payload: UpdateTaskRequest): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(`/tasks/${taskId}`, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });
  return response.task;
}

export async function changeTaskStatus(
  taskId: string,
  payload: ChangeTaskStatusRequest,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(`/tasks/${taskId}/status`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response.task;
}

export async function getWorkflowMetadata(): Promise<WorkflowMetadata> {
  const [statusesResponse, transitionsResponse, prioritiesResponse] = await Promise.all([
    apiRequest<{ statuses: WorkflowMetadata["statuses"] }>("/task-statuses"),
    apiRequest<{ transitions: WorkflowMetadata["transitions"] }>("/task-status-transitions"),
    apiRequest<{ priorities: WorkflowMetadata["priorities"] }>("/task-priorities"),
  ]);

  return {
    statuses: statusesResponse.statuses,
    transitions: transitionsResponse.transitions,
    priorities: prioritiesResponse.priorities,
  };
}
