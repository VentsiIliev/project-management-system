import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject } from "../api/projectsApi";
import { type Project } from "../types";
import { projectQueryKey } from "./useProjectQuery";
import { projectsQueryKey } from "./useProjectsQuery";
import { type CreateProjectFormValues } from "../schemas/createProjectSchema";


export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateProjectFormValues) =>
      createProject({
        ...values,
        code: values.code.toUpperCase(),
        description: values.description?.trim() || undefined,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
      }),
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKey(project.id), project);
      queryClient.setQueryData<Project[] | undefined>(projectsQueryKey, (projects) => {
        const currentProjects = projects ?? [];
        return currentProjects.some((currentProject) => currentProject.id === project.id)
          ? currentProjects
          : [...currentProjects, project];
      });
    },
  });
}
