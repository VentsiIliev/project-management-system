import { useQuery } from "@tanstack/react-query";

import { getProjects } from "../api/projectsApi";

export const projectsQueryKey = ["projects"];

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: getProjects,
  });
}
