import { useQuery } from "@tanstack/react-query";

import { getWorkflowMetadata } from "../api/projectsApi";


export const workflowMetadataQueryKey = ["tasks", "workflow-metadata"];

export function useWorkflowMetadataQuery(enabled: boolean) {
  return useQuery({
    enabled,
    queryKey: workflowMetadataQueryKey,
    queryFn: getWorkflowMetadata,
  });
}
