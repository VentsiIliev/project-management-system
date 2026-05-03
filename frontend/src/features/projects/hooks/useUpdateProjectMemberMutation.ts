import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectMember } from "../api/projectsApi";
import { type ProjectMember, type ProjectMemberRole } from "../types";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectQueryKey } from "./useProjectQuery";
import { projectMembersQueryKey } from "./useProjectMembersQuery";

type UpdateProjectMemberArgs = {
  role: ProjectMemberRole;
  userId: string;
};

export function useUpdateProjectMemberMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ role, userId }: UpdateProjectMemberArgs) => {
      if (!projectId) {
        throw new Error("Project id is required to update a project member.");
      }

      return updateProjectMember(projectId, userId, { role });
    },
    onSuccess: async (member) => {
      if (!projectId) {
        return;
      }

      queryClient.setQueryData<ProjectMember[] | undefined>(
        projectMembersQueryKey(projectId),
        (currentMembers) =>
          (currentMembers ?? []).map((currentMember) =>
            currentMember.user_id === member.user_id ? member : currentMember,
          ),
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: projectActivityQueryKey(projectId),
          exact: true,
        }),
      ]);
    },
  });
}
