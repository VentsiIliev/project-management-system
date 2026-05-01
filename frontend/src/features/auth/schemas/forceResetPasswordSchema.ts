import { z } from "zod";

const minimumPasswordLength = 8;

export const forceResetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(1, "Enter a new password.")
      .min(
        minimumPasswordLength,
        `Use at least ${minimumPasswordLength} characters.`,
      ),
    confirm_password: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type ForceResetPasswordFormValues = z.infer<
  typeof forceResetPasswordSchema
>;
