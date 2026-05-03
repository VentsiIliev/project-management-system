import { apiRequest } from "../../../api/client";
import {
  type ActivityEntry,
  type AddTaskDependencyRequest,
  type AddProjectMemberRequest,
  type ChangeTaskStatusRequest,
  type Comment,
  type CreateCommentRequest,
  type CreateTaskRequest,
  type CreateProjectRequest,
  type DeleteTaskRequest,
  type DeleteProjectRequest,
  type Notification,
  type MyTaskQueryParams,
  type PaginatedTaskList,
  type Pagination,
  type ProjectMember,
  type ProjectTaskQueryParams,
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

export async function getProjectActivity(projectId: string): Promise<ActivityEntry[]> {
  const response = await apiRequest<{ activity: ActivityEntry[] }>(`/projects/${projectId}/activity`);
  return response.activity;
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

function buildQueryString(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }
    searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function defaultPagination(count: number, pageSize: number): Pagination {
  return {
    page: 1,
    page_size: pageSize,
    total_count: count,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  };
}

function normalizeTaskListResponse(
  response: { tasks: Task[]; pagination?: Pagination },
  pageSize: number,
): PaginatedTaskList {
  return {
    tasks: response.tasks,
    pagination: response.pagination ?? defaultPagination(response.tasks.length, pageSize),
  };
}

export async function getProjectTasks(
  projectId: string,
  params: ProjectTaskQueryParams = {},
): Promise<PaginatedTaskList> {
  const pageSize = params.page_size ?? 10;
  const queryParams = {
    ...params,
    is_blocked: params.is_blocked || undefined,
    page: params.page && params.page > 1 ? params.page : undefined,
    page_size: params.page_size && params.page_size !== 10 ? params.page_size : undefined,
  };
  const response = await apiRequest<{ tasks: Task[]; pagination?: Pagination }>(
    `/projects/${projectId}/tasks${buildQueryString(queryParams)}`,
  );
  return normalizeTaskListResponse(response, pageSize);
}

export async function getMyTasks(params: MyTaskQueryParams = {}): Promise<PaginatedTaskList> {
  const pageSize = params.page_size ?? 10;
  const queryParams = {
    ...params,
    include_collaborator_tasks: params.include_collaborator_tasks || undefined,
    page: params.page && params.page > 1 ? params.page : undefined,
    page_size: params.page_size && params.page_size !== 10 ? params.page_size : undefined,
    sort_by: params.sort_by && params.sort_by !== "deadline" ? params.sort_by : undefined,
  };
  const response = await apiRequest<{ tasks: Task[]; pagination?: Pagination }>(
    `/tasks${buildQueryString(queryParams)}`,
  );
  return normalizeTaskListResponse(response, pageSize);
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

export async function getTaskActivity(taskId: string): Promise<ActivityEntry[]> {
  const response = await apiRequest<{ activity: ActivityEntry[] }>(`/tasks/${taskId}/activity`);
  return response.activity;
}

export async function getTaskComments(
  taskId: string,
  sinceCommentId?: string | null,
): Promise<Comment[]> {
  const query = sinceCommentId ? `?since_comment_id=${sinceCommentId}` : "";
  const response = await apiRequest<{ comments: Comment[] }>(`/tasks/${taskId}/comments${query}`);
  return response.comments;
}

export async function createTaskComment(
  taskId: string,
  payload: CreateCommentRequest,
): Promise<Comment> {
  const response = await apiRequest<{ comment: Comment }>(`/tasks/${taskId}/comments`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response.comment;
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

export async function deleteTask(taskId: string, payload: DeleteTaskRequest): Promise<void> {
  await apiRequest(`/tasks/${taskId}`, {
    body: JSON.stringify(payload),
    method: "DELETE",
  });
}

export async function getTaskDependencies(taskId: string): Promise<Task["dependencies"]> {
  const response = await apiRequest<{ dependencies: Task["dependencies"] }>(
    `/tasks/${taskId}/dependencies`,
  );
  return response.dependencies;
}

export async function addTaskDependency(
  taskId: string,
  payload: AddTaskDependencyRequest,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(`/tasks/${taskId}/dependencies`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response.task;
}

export async function removeTaskDependency(
  taskId: string,
  dependsOnTaskId: string,
): Promise<Task> {
  const response = await apiRequest<{ task: Task }>(
    `/tasks/${taskId}/dependencies/${dependsOnTaskId}`,
    {
      method: "DELETE",
    },
  );
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

export async function getNotifications(
  page = 1,
  pageSize = 10,
): Promise<{ notifications: Notification[]; pagination: Pagination }> {
  return apiRequest<{ notifications: Notification[]; pagination: Pagination }>(
    `/notifications?page=${page}&page_size=${pageSize}`,
  );
}

export async function markNotificationRead(notificationId: string): Promise<Notification> {
  const response = await apiRequest<{ notification: Notification }>(
    `/notifications/${notificationId}/read`,
    { method: "POST" },
  );
  return response.notification;
}

export async function markAllNotificationsRead(): Promise<{ updated_count: number }> {
  return apiRequest<{ updated_count: number }>("/notifications/read-all", { method: "POST" });
}
