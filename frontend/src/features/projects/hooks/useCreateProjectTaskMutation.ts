import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProjectTask } from "../api/projectsApi";
import { type CreateTaskRequest, type PaginatedTaskList } from "../types";
import { myTasksQueryKeyPrefix } from "./useMyTasksQuery";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectQueryKey } from "./useProjectQuery";
import { projectTasksQueryKeyPrefix } from "./useProjectTasksQuery";
import { projectsQueryKey } from "./useProjectsQuery";
import { taskActivityQueryKey } from "./useTaskActivityQuery";


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

      queryClient.setQueriesData<PaginatedTaskList | undefined>(
        { queryKey: projectTasksQueryKeyPrefix(projectId) },
        (currentTaskList) =>
          currentTaskList
            ? {
                ...currentTaskList,
                tasks: [...currentTaskList.tasks, task].sort((left, right) =>
                  left.task_key.localeCompare(right.task_key, undefined, {
                    numeric: true,
                    sensitivity: "base",
                  }),
                ),
                pagination: {
                  ...currentTaskList.pagination,
                  total_count: currentTaskList.pagination.total_count + 1,
                },
              }
            : currentTaskList,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectTasksQueryKeyPrefix(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectActivityQueryKey(projectId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: projectsQueryKey,
          exact: true,
        }),
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
