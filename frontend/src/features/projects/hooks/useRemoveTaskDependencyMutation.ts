import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeTaskDependency } from "../api/projectsApi";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { taskActivityQueryKey } from "./useTaskActivityQuery";
import { taskQueryKey } from "./useTaskQuery";


export function useRemoveTaskDependencyMutation(projectId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dependsOnTaskId: string) => {
      if (!taskId) {
        throw new Error("Task id is required to remove a dependency.");
      }

      return removeTaskDependency(taskId, dependsOnTaskId);
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
