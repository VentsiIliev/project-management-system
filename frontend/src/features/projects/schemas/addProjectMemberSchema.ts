import { z } from "zod";

export const addProjectMemberSchema = z.object({
  user_id: z.string().uuid("Enter a valid user ID."),
  role: z.enum(["PROJECT_MANAGER", "TEAM_MEMBER"]),
});

export type AddProjectMemberFormValues = z.infer<typeof addProjectMemberSchema>;
