import { type ReactNode } from "react";

import { Button } from "../../../components/Button";
import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { type SessionUser } from "../types";
import { AuthFrame } from "./AuthFrame";

type SessionGateProps = {
  children: (session: SessionUser | null) => ReactNode;
};

export function SessionGate({ children }: SessionGateProps) {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isPending) {
    return (
      <AuthFrame
        eyebrow="Authentication"
        title="Loading your workspace"
        summary="Checking for an active session before rendering the application shell."
      >
        <Panel>
          <StatusMessage title="Connecting">
            Checking your existing session.
          </StatusMessage>
        </Panel>
      </AuthFrame>
    );
  }

  if (sessionQuery.isError) {
    return (
      <AuthFrame
        eyebrow="Authentication"
        title="Session bootstrap failed"
        summary="The shell could not confirm your current session because the API is unavailable or returned an unexpected response."
      >
        <Panel>
          <StatusMessage tone="error" title="Connection problem">
            The authentication service could not be reached. Retry once the backend is available.
          </StatusMessage>
          <Button onClick={() => sessionQuery.refetch()} type="button">
            Retry session check
          </Button>
        </Panel>
      </AuthFrame>
    );
  }

  return <>{children(sessionQuery.data ?? null)}</>;
}
