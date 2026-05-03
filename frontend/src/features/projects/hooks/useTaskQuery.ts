import { useQuery } from "@tanstack/react-query";

import { getTask } from "../api/projectsApi";


export function taskQueryKey(taskId: string) {
  return ["tasks", taskId];
}

export function useTaskQuery(taskId: string | null) {
  return useQuery({
    enabled: Boolean(taskId),
    queryKey: taskId ? taskQueryKey(taskId) : ["tasks", "idle"],
    queryFn: () => getTask(taskId!),
  });
}
