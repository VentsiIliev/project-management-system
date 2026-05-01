import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login } from "../api/authApi";
import { type LoginFormValues } from "../schemas/loginSchema";
import { clearAuthUiNotice } from "../state/authUiState";
import { sessionQueryKey } from "./useSessionQuery";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    onMutate: () => {
      clearAuthUiNotice();
    },
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
      navigate(session.must_reset_password ? "/reset-password" : "/");
    },
  });
}
