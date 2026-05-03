import { useQuery } from "@tanstack/react-query";

import { getMyTasks } from "../api/projectsApi";
import { type MyTaskQueryParams } from "../types";

export const myTasksQueryKeyPrefix = ["tasks", "my-list"];

export function myTasksQueryKey(params: MyTaskQueryParams) {
  return [...myTasksQueryKeyPrefix, params];
}

export function useMyTasksQuery(params: MyTaskQueryParams) {
  return useQuery({
    queryKey: myTasksQueryKey(params),
    queryFn: () => getMyTasks(params),
  });
}
