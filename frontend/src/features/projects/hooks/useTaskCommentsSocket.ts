import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { getTaskComments } from "../api/projectsApi";
import { type Comment } from "../types";
import { taskCommentsQueryKey } from "./useTaskCommentsQuery";

type LiveCommentsState = "idle" | "connecting" | "connected" | "reconnecting" | "unavailable";

function appendUniqueComments(currentComments: Comment[] | undefined, incomingComments: Comment[]) {
  const existingComments = currentComments ?? [];
  const knownIds = new Set(existingComments.map((comment) => comment.id));
  const nextComments = [...existingComments];

  for (const comment of incomingComments) {
    if (!knownIds.has(comment.id)) {
      nextComments.push(comment);
      knownIds.add(comment.id);
    }
  }

  return nextComments;
}

function buildTaskCommentsSocketUrl(taskId: string) {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/tasks/${taskId}/comments`;
}

export function useTaskCommentsSocket(taskId: string | null, comments: Comment[] | undefined) {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<LiveCommentsState>("idle");
  const latestCommentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (comments?.length) {
      latestCommentIdRef.current = comments[comments.length - 1]?.id ?? null;
    }
  }, [comments]);

  useEffect(() => {
    if (!taskId) {
      latestCommentIdRef.current = null;
      setConnectionState("idle");
      return;
    }

    if (typeof window === "undefined" || typeof window.WebSocket === "undefined") {
      setConnectionState("unavailable");
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimeout: number | null = null;
    let reconnectAttempts = 0;
    let isActive = true;
    let hasConnected = false;

    const syncMissedComments = async () => {
      if (!taskId || !latestCommentIdRef.current) {
        return;
      }

      try {
        const comments = await getTaskComments(taskId, latestCommentIdRef.current);
        if (!isActive || comments.length === 0) {
          return;
        }

        latestCommentIdRef.current = comments[comments.length - 1]?.id ?? latestCommentIdRef.current;
        queryClient.setQueryData<Comment[] | undefined>(
          taskCommentsQueryKey(taskId),
          (currentComments) => appendUniqueComments(currentComments, comments),
        );
      } catch {
        return;
      }
    };

    const openSocket = () => {
      if (!isActive) {
        return;
      }

      setConnectionState(hasConnected ? "reconnecting" : "connecting");
      socket = new window.WebSocket(buildTaskCommentsSocketUrl(taskId));

      socket.onopen = () => {
        const shouldSyncMissedComments = hasConnected;
        hasConnected = true;
        reconnectAttempts = 0;
        setConnectionState("connected");
        if (shouldSyncMissedComments) {
          void syncMissedComments();
        }
      };

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data) as { type?: string; comment?: Comment };
        if (payload.type !== "comment.created" || !payload.comment) {
          return;
        }

        latestCommentIdRef.current = payload.comment.id;
        queryClient.setQueryData<Comment[] | undefined>(
          taskCommentsQueryKey(taskId),
          (currentComments) => appendUniqueComments(currentComments, [payload.comment!]),
        );
      };

      socket.onclose = (event) => {
        if (!isActive) {
          return;
        }

        if (event.code === 4403) {
          setConnectionState("unavailable");
          return;
        }

        setConnectionState("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
        reconnectAttempts += 1;
        reconnectTimeout = window.setTimeout(openSocket, delay);
      };
    };

    openSocket();

    return () => {
      isActive = false;
      if (reconnectTimeout !== null) {
        window.clearTimeout(reconnectTimeout);
      }
      socket?.close();
    };
  }, [queryClient, taskId]);

  return connectionState;
}
