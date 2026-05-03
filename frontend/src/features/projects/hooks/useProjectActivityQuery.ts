import { useQuery } from "@tanstack/react-query";

import { getProjectActivity } from "../api/projectsApi";

export function projectActivityQueryKey(projectId: string) {
  return ["projects", projectId, "activity"];
}

export function useProjectActivityQuery(projectId: string | null) {
  return useQuery({
    enabled: Boolean(projectId),
    queryKey: projectId ? projectActivityQueryKey(projectId) : ["projects", "activity", "idle"],
    queryFn: () => getProjectActivity(projectId!),
  });
}
