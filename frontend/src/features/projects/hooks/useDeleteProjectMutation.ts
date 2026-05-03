import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "../api/projectsApi";
import { type Project } from "../types";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectQueryKey } from "./useProjectQuery";
import { projectsQueryKey } from "./useProjectsQuery";

export function useDeleteProjectMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!projectId) {
        throw new Error("Project id is required to delete a project.");
      }

      await deleteProject(projectId, { confirm_project_delete: true });
    },
    onSuccess: () => {
      if (!projectId) {
        return;
      }

      queryClient.setQueryData<Project[] | undefined>(projectsQueryKey, (projects) =>
        (projects ?? []).filter((project) => project.id !== projectId),
      );
      queryClient.removeQueries({ queryKey: projectQueryKey(projectId), exact: true });
      queryClient.removeQueries({ queryKey: projectActivityQueryKey(projectId), exact: true });
    },
  });
}
