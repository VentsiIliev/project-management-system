import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTask } from "../api/projectsApi";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { type DeleteTaskRequest } from "../types";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { taskQueryKey } from "./useTaskQuery";


export function useDeleteTaskMutation(projectId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteTaskRequest) => {
      if (!taskId) {
        throw new Error("Task id is required to delete a task.");
      }

      await deleteTask(taskId, payload);
    },
    onSuccess: async () => {
      if (!taskId) {
        return;
      }

      queryClient.removeQueries({ queryKey: taskQueryKey(taskId), exact: true });

      if (projectId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: projectTasksQueryKeyPrefix(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: projectActivityQueryKey(projectId),
            exact: true,
          }),
          queryClient.invalidateQueries({
            queryKey: myTasksQueryKeyPrefix,
          }),
        ]);
      }
    },
  });
}
