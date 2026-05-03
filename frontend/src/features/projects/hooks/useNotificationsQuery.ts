import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/projectsApi";

export function notificationsQueryKey(page: number, pageSize: number) {
  return ["notifications", page, pageSize];
}

export function useNotificationsQuery(page: number, pageSize: number) {
  return useQuery({
    queryKey: notificationsQueryKey(page, pageSize),
    queryFn: () => getNotifications(page, pageSize),
  });
}
