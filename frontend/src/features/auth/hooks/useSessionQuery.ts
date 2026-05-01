import { useQuery } from "@tanstack/react-query";

import { fetchSession } from "../api/authApi";

export const sessionQueryKey = ["auth", "session"] as const;

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
  });
}
