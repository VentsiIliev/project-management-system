import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProjectTask } from "../api/projectsApi";
import { type CreateTaskRequest, type Task } from "../types";
import { projectQueryKey } from "./useProjectQuery";
import { projectsQueryKey } from "./useProjectsQuery";
import { projectTasksQueryKey } from "./useProjectTasksQuery";


export function useCreateProjectTaskMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskRequest) => {
      if (!projectId) {
        throw new Error("Project id is required to create a task.");
      }

      return createProjectTask(projectId, payload);
    },
    onSuccess: async (task) => {
      if (!projectId) {
        return;
      }

      queryClient.setQueryData<Task[] | undefined>(
        projectTasksQueryKey(projectId),
        (currentTasks) => [...(currentTasks ?? []), task].sort((left, right) =>
          left.task_key.localeCompare(right.task_key, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        ),
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: projectsQueryKey,
          exact: true,
        }),
      ]);
    },
  });
}
