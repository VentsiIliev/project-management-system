import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTaskComment } from "../api/projectsApi";
import { type Comment, type CreateCommentRequest } from "../types";
import { taskCommentsQueryKey } from "./useTaskCommentsQuery";

function appendUniqueComment(currentComments: Comment[] | undefined, nextComment: Comment) {
  const existingComments = currentComments ?? [];
  return existingComments.some((comment) => comment.id === nextComment.id)
    ? existingComments
    : [...existingComments, nextComment];
}

export function useCreateTaskCommentMutation(taskId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentRequest) => {
      if (!taskId) {
        throw new Error("Task id is required to create a comment.");
      }

      return createTaskComment(taskId, payload);
    },
    onSuccess: (comment) => {
      if (!taskId) {
        return;
      }

      queryClient.setQueryData<Comment[] | undefined>(
        taskCommentsQueryKey(taskId),
        (currentComments) => appendUniqueComment(currentComments, comment),
      );
    },
  });
}
