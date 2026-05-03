import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTask } from "../api/projectsApi";
import { type PaginatedTaskList, type Task, type UpdateTaskRequest } from "../types";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { taskActivityQueryKey } from "./useTaskActivityQuery";
import { taskQueryKey } from "./useTaskQuery";


function updateTaskInList(currentTaskList: PaginatedTaskList | undefined, nextTask: Task) {
  if (!currentTaskList) {
    return currentTaskList;
  }

  return {
    ...currentTaskList,
    tasks: currentTaskList.tasks.map((task) => (task.id === nextTask.id ? nextTask : task)),
  };
}


export function useUpdateTaskMutation(projectId: string | null, taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTaskRequest) => {
      if (!taskId) {
        throw new Error("Task id is required to update a task.");
      }

      return updateTask(taskId, payload);
    },
    onSuccess: async (task) => {
      queryClient.setQueryData(taskQueryKey(task.id), task);

      if (projectId) {
        queryClient.setQueriesData<PaginatedTaskList | undefined>(
          { queryKey: projectTasksQueryKeyPrefix(projectId) },
          (currentTasks) => updateTaskInList(currentTasks, task),
        );
      }

      await Promise.all([
        projectId
          ? queryClient.invalidateQueries({
              queryKey: projectTasksQueryKeyPrefix(projectId),
            })
          : Promise.resolve(),
        projectId
          ? queryClient.invalidateQueries({
              queryKey: projectActivityQueryKey(projectId),
              exact: true,
            })
          : Promise.resolve(),
        queryClient.invalidateQueries({
          queryKey: taskActivityQueryKey(task.id),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: myTasksQueryKeyPrefix,
        }),
      ]);
    },
  });
}
