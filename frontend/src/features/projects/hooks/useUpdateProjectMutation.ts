import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProject } from "../api/projectsApi";
import { type Project } from "../types";
import { projectQueryKey } from "./useProjectQuery";
import { projectsQueryKey } from "./useProjectsQuery";
import { type UpdateProjectFormValues } from "../schemas/updateProjectSchema";

export function useUpdateProjectMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateProjectFormValues) =>
      updateProject(projectId!, {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
      }),
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKey(project.id), project);
      queryClient.setQueryData<Project[] | undefined>(projectsQueryKey, (projects) =>
        projects?.map((currentProject) =>
          currentProject.id === project.id
            ? {
                ...currentProject,
                name: project.name,
                description: project.description,
                start_date: project.start_date,
                end_date: project.end_date,
              }
            : currentProject,
        ) ?? [],
      );
    },
  });
}
