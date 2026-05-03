import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeTaskStatus } from "../api/projectsApi";
import { type ChangeTaskStatusRequest, type Task } from "../types";
import { projectTasksQueryKey } from "./useProjectTasksQuery";
import { taskQueryKey } from "./useTaskQuery";


function updateTaskInList(currentTasks: Task[] | undefined, nextTask: Task) {
  if (!currentTasks) {
    return currentTasks;
  }

  return currentTasks.map((task) => (task.id === nextTask.id ? nextTask : task));
}


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
        queryClient.setQueryData<Task[] | undefined>(
          projectTasksQueryKey(projectId),
          (currentTasks) => updateTaskInList(currentTasks, task),
        );
      }
    },
  });
}
