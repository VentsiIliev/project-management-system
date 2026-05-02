import { z } from "zod";


export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required."),
    code: z
      .string()
      .trim()
      .min(1, "Project code is required.")
      .max(32, "Project code must be 32 characters or fewer."),
    description: z.string().trim().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.start_date && values.end_date && values.end_date < values.start_date) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than start date.",
        path: ["end_date"],
      });
    }
  });

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
