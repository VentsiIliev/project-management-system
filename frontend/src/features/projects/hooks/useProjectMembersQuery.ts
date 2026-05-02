import { useQuery } from "@tanstack/react-query";

import { getProjectMembers } from "../api/projectsApi";

export function projectMembersQueryKey(projectId: string) {
  return ["projects", projectId, "members"];
}

export function useProjectMembersQuery(projectId: string | null) {
  return useQuery({
    enabled: Boolean(projectId),
    queryKey: projectId ? projectMembersQueryKey(projectId) : ["projects", "members", "idle"],
    queryFn: () => getProjectMembers(projectId!),
  });
}
