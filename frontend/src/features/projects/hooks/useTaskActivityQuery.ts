import { useQuery } from "@tanstack/react-query";

import { getTaskActivity } from "../api/projectsApi";

export function taskActivityQueryKey(taskId: string) {
  return ["tasks", taskId, "activity"];
}

export function useTaskActivityQuery(taskId: string | null) {
  return useQuery({
    enabled: Boolean(taskId),
    queryKey: taskId ? taskActivityQueryKey(taskId) : ["tasks", "activity", "idle"],
    queryFn: () => getTaskActivity(taskId!),
  });
}
