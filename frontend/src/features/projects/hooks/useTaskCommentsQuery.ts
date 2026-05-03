import { useQuery } from "@tanstack/react-query";

import { getTaskComments } from "../api/projectsApi";

export function taskCommentsQueryKey(taskId: string) {
  return ["tasks", taskId, "comments"];
}

export function useTaskCommentsQuery(taskId: string | null) {
  return useQuery({
    enabled: Boolean(taskId),
    queryKey: taskId ? taskCommentsQueryKey(taskId) : ["tasks", "comments", "idle"],
    queryFn: () => getTaskComments(taskId!),
  });
}
