import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isApiError } from "../../../api/client";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useAuthUiStore } from "../state/authUiState";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/loginSchema";
import { AuthFrame } from "../components/AuthFrame";

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const authNotice = useAuthUiStore((state) => state.notice);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const loginError =
    isApiError(loginMutation.error) && loginMutation.error.code === "INVALID_CREDENTIALS"
      ? loginMutation.error.message
      : null;
  const rateLimitedError =
    isApiError(loginMutation.error) && loginMutation.error.code === "RATE_LIMITED"
      ? loginMutation.error.message
      : null;

  return (
    <AuthFrame
      eyebrow="Project Management System"
      title="Sign in to continue"
      summary="Use your company email and password to open the authenticated shell. Only session bootstrap and login are active in this slice."
    >
      <Panel className="auth-panel">
        <div className="panel-heading">
          <h2 className="panel-heading__title">User login</h2>
          <p className="panel-heading__body">
            Unauthenticated users are routed here until the session bootstrap succeeds.
          </p>
        </div>
        {authNotice === "session-expired" ? (
          <StatusMessage tone="error" title="Session expired">
            Your session expired after inactivity. Sign in again to continue.
          </StatusMessage>
        ) : null}
        <form
          className="form-stack"
          onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        >
          <Field
            autoComplete="email"
            error={errors.email?.message}
            label="Email"
            type="email"
            {...register("email")}
          />
          <Field
            autoComplete="current-password"
            error={errors.password?.message}
            label="Password"
            type="password"
            {...register("password")}
          />
          {loginError ? (
            <StatusMessage tone="error" title="Sign-in failed">
              {loginError}
            </StatusMessage>
          ) : null}
          {rateLimitedError ? (
            <StatusMessage tone="error" title="Too many attempts">
              {rateLimitedError}
            </StatusMessage>
          ) : null}
          <Button disabled={loginMutation.isPending} fullWidth type="submit">
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Panel>
    </AuthFrame>
  );
}
