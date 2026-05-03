import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTask } from "../api/projectsApi";
import { type Task, type UpdateTaskRequest } from "../types";
import { projectTasksQueryKey } from "./useProjectTasksQuery";
import { taskQueryKey } from "./useTaskQuery";


function updateTaskInList(currentTasks: Task[] | undefined, nextTask: Task) {
  if (!currentTasks) {
    return currentTasks;
  }

  return currentTasks.map((task) => (task.id === nextTask.id ? nextTask : task));
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
        queryClient.setQueryData<Task[] | undefined>(
          projectTasksQueryKey(projectId),
          (currentTasks) => updateTaskInList(currentTasks, task),
        );
      }
    },
  });
}
