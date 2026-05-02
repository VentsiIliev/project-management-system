import { useQuery } from "@tanstack/react-query";

import { getProject } from "../api/projectsApi";

export function projectQueryKey(projectId: string) {
  return ["projects", projectId];
}

export function useProjectQuery(projectId: string | null) {
  return useQuery({
    enabled: Boolean(projectId),
    queryKey: projectId ? projectQueryKey(projectId) : ["projects", "idle"],
    queryFn: () => getProject(projectId!),
  });
}
