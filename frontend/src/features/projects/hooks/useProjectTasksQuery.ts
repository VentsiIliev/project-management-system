import { useQuery } from "@tanstack/react-query";

import { getProjectTasks } from "../api/projectsApi";
import { type ProjectTaskQueryParams } from "../types";


export function projectTasksQueryKeyPrefix(projectId: string) {
  return ["projects", projectId, "tasks"];
}

export function projectTasksQueryKey(projectId: string, params: ProjectTaskQueryParams) {
  return [...projectTasksQueryKeyPrefix(projectId), params];
}

export function useProjectTasksQuery(projectId: string | null, params: ProjectTaskQueryParams) {
  return useQuery({
    enabled: Boolean(projectId),
    queryKey: projectId ? projectTasksQueryKey(projectId, params) : ["projects", "tasks", "idle"],
    queryFn: () => getProjectTasks(projectId!, params),
  });
}
