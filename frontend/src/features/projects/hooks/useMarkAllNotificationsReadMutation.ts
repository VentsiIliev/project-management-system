import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsRead } from "../api/projectsApi";

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
