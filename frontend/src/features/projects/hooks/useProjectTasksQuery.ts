import { useQuery } from "@tanstack/react-query";

import { getProjectTasks } from "../api/projectsApi";


export function projectTasksQueryKey(projectId: string) {
  return ["projects", projectId, "tasks"];
}

export function useProjectTasksQuery(projectId: string | null) {
  return useQuery({
    enabled: Boolean(projectId),
    queryKey: projectId ? projectTasksQueryKey(projectId) : ["projects", "tasks", "idle"],
    queryFn: () => getProjectTasks(projectId!),
  });
}
