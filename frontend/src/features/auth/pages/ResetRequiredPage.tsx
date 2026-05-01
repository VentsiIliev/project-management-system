import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isApiError } from "../../../api/client";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { type SessionUser } from "../types";
import { AuthFrame } from "../components/AuthFrame";
import { useForceResetPasswordMutation } from "../hooks/useForceResetPasswordMutation";
import { useLogoutMutation } from "../hooks/useLogoutMutation";
import {
  forceResetPasswordSchema,
  type ForceResetPasswordFormValues,
} from "../schemas/forceResetPasswordSchema";

type ResetRequiredPageProps = {
  user: SessionUser;
};

function getDetailMessages(detail: unknown): string[] {
  if (typeof detail === "string") {
    return [detail];
  }

  if (Array.isArray(detail)) {
    return detail.filter(
      (message): message is string => typeof message === "string" && message.length > 0,
    );
  }

  return [];
}

export function ResetRequiredPage({ user }: ResetRequiredPageProps) {
  const resetPasswordMutation = useForceResetPasswordMutation();
  const logoutMutation = useLogoutMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForceResetPasswordFormValues>({
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
    resolver: zodResolver(forceResetPasswordSchema),
  });

  const resetError = isApiError(resetPasswordMutation.error)
    ? resetPasswordMutation.error
    : null;
  const serverPasswordError = getDetailMessages(
    resetError?.details.new_password,
  )[0];
  const serverErrorMessage =
    Object.entries(resetError?.details ?? {})
      .flatMap(([field, detail]) =>
        field === "new_password" ? [] : getDetailMessages(detail),
      )[0] ??
    (resetError && !serverPasswordError ? resetError.message : null);

  return (
    <AuthFrame
      eyebrow="Password reset required"
      title="Your temporary password must be replaced"
      summary="Choose a permanent password to leave the restricted auth shell. The backend still applies the full password policy after this explicit client-side validation."
    >
      <Panel className="auth-panel">
        <div className="panel-heading">
          <h2 className="panel-heading__title">Set a permanent password</h2>
          <p className="panel-heading__body">
            {user.name} is signed in with <strong>{user.email}</strong>.
          </p>
        </div>
        <StatusMessage title="Main app access is still blocked">
          Finish this reset before you can enter the authenticated shell.
        </StatusMessage>
        <form
          className="form-stack"
          onSubmit={handleSubmit((values) => {
            resetPasswordMutation.reset();
            resetPasswordMutation.mutate(values);
          })}
        >
          <Field
            autoComplete="new-password"
            error={errors.new_password?.message ?? serverPasswordError}
            label="New password"
            type="password"
            {...register("new_password")}
          />
          <Field
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            label="Confirm new password"
            type="password"
            {...register("confirm_password")}
          />
          {serverErrorMessage ? (
            <StatusMessage tone="error" title="Password reset failed">
              {serverErrorMessage}
            </StatusMessage>
          ) : null}
          <Button
            disabled={resetPasswordMutation.isPending}
            fullWidth
            type="submit"
          >
            {resetPasswordMutation.isPending
              ? "Updating password..."
              : "Set new password"}
          </Button>
          <Button
            disabled={logoutMutation.isPending}
            fullWidth
            onClick={() => logoutMutation.mutate()}
            type="button"
            variant="secondary"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </form>
      </Panel>
    </AuthFrame>
  );
}
