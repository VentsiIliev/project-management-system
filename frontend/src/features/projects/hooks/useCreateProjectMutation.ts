import { useMutation } from "@tanstack/react-query";

import { createProject } from "../api/projectsApi";
import { type CreateProjectFormValues } from "../schemas/createProjectSchema";


export function useCreateProjectMutation() {
  return useMutation({
    mutationFn: (values: CreateProjectFormValues) =>
      createProject({
        ...values,
        code: values.code.toUpperCase(),
        description: values.description?.trim() || undefined,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
      }),
  });
}
