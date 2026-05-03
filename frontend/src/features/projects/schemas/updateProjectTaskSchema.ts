import { z } from "zod";


export const updateProjectTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Task title is required.").max(255, "Task title is too long."),
    description: z.string().optional(),
    priority_id: z.string().optional(),
    start_date: z.string().optional(),
    deadline: z.string().optional(),
    primary_assignee_id: z.string().optional(),
    collaborator_ids: z.array(z.string()).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.start_date && value.deadline && value.deadline < value.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deadline cannot be earlier than start date.",
        path: ["deadline"],
      });
    }
  });

export type UpdateProjectTaskFormValues = z.infer<typeof updateProjectTaskSchema>;
