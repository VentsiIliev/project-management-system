import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProjectMember } from "../api/projectsApi";
import { type Project, type ProjectMember } from "../types";
import { projectQueryKey } from "./useProjectQuery";
import { projectMembersQueryKey } from "./useProjectMembersQuery";
import { projectsQueryKey } from "./useProjectsQuery";

type RemoveProjectMemberArgs = {
  userId: string;
};

export function useRemoveProjectMemberMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: RemoveProjectMemberArgs) => {
      if (!projectId) {
        throw new Error("Project id is required to remove a project member.");
      }

      await removeProjectMember(projectId, userId);
      return { userId };
    },
    onSuccess: async ({ userId }) => {
      if (!projectId) {
        return;
      }

      queryClient.setQueryData<ProjectMember[] | undefined>(
        projectMembersQueryKey(projectId),
        (currentMembers) =>
          (currentMembers ?? []).filter((member) => member.user_id !== userId),
      );
      queryClient.setQueryData<Project[] | undefined>(projectsQueryKey, (currentProjects) =>
        currentProjects ?? [],
      );

      await queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
        exact: true,
      });
    },
  });
}
