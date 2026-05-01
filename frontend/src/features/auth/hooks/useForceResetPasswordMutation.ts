import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { forceResetPassword } from "../api/authApi";
import { type ForceResetPasswordFormValues } from "../schemas/forceResetPasswordSchema";
import { sessionQueryKey } from "./useSessionQuery";

export function useForceResetPasswordMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ new_password }: ForceResetPasswordFormValues) =>
      forceResetPassword({ new_password }),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
      navigate(session.must_reset_password ? "/reset-password" : "/");
    },
  });
}
