import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProjectMember } from "../api/projectsApi";
import { type AddProjectMemberRequest, type ProjectMember } from "../types";
import { projectActivityQueryKey } from "./useProjectActivityQuery";
import { projectMembersQueryKey } from "./useProjectMembersQuery";

export function useAddProjectMemberMutation(projectId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddProjectMemberRequest) => {
      if (!projectId) {
        throw new Error("Project id is required to add a project member.");
      }

      return addProjectMember(projectId, payload);
    },
    onSuccess: async (member) => {
      if (!projectId) {
        return;
      }

      queryClient.setQueryData<ProjectMember[] | undefined>(
        projectMembersQueryKey(projectId),
        (currentMembers) => {
          const nextMembers = (currentMembers ?? []).filter(
            (currentMember) => currentMember.user_id !== member.user_id,
          );
          nextMembers.push(member);
          return nextMembers.sort((left, right) => left.name.localeCompare(right.name));
        },
      );

      await queryClient.invalidateQueries({
        queryKey: projectActivityQueryKey(projectId),
        exact: true,
      });
    },
  });
}
