import { z } from "zod";

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required").max(255, "Project name is too long"),
    description: z.string().max(5000, "Description is too long").optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.start_date && values.end_date && values.end_date < values.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than start date.",
        path: ["end_date"],
      });
    }
  });

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
