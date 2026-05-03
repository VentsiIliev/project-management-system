import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeTaskStatus } from "../api/projectsApi";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { type ChangeTaskStatusRequest } from "../types";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { taskActivityQueryKey } from "./useTaskActivityQuery";
import { taskQueryKey } from "./useTaskQuery";


export function useChangeTaskStatusMutation(projectId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ChangeTaskStatusRequest) => {
      if (!taskId) {
        throw new Error("Task id is required to change task status.");
      }

      return changeTaskStatus(taskId, payload);
    },
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKey(task.id), task);

      if (projectId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: projectTasksQueryKeyPrefix(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: projectActivityQueryKey(projectId),
            exact: true,
          }),
        ]);
      }

      await queryClient.invalidateQueries({
        queryKey: taskActivityQueryKey(task.id),
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: myTasksQueryKeyPrefix,
      });
    },
  });
}
