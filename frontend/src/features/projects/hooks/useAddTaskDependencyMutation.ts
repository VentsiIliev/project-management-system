import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addTaskDependency } from "../api/projectsApi";
import { type AddTaskDependencyRequest } from "../types";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { taskActivityQueryKey } from "./useTaskActivityQuery";
import { taskQueryKey } from "./useTaskQuery";


export function useAddTaskDependencyMutation(projectId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddTaskDependencyRequest) => {
      if (!taskId) {
        throw new Error("Task id is required to add a dependency.");
      }

      return addTaskDependency(taskId, payload);
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
