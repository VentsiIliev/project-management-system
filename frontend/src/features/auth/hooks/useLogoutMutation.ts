import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { logout } from "../api/authApi";
import { clearAuthUiNotice } from "../state/authUiState";
import { sessionQueryKey } from "./useSessionQuery";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthUiNotice();
      queryClient.setQueryData(sessionQueryKey, null);
      navigate("/login");
    },
  });
}
