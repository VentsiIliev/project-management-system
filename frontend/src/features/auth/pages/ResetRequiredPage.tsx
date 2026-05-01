import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { type SessionUser } from "../types";
import { AuthFrame } from "../components/AuthFrame";

type ResetRequiredPageProps = {
  user: SessionUser;
};

export function ResetRequiredPage({ user }: ResetRequiredPageProps) {
  return (
    <AuthFrame
      eyebrow="Password reset required"
      title="Your temporary password must be replaced"
      summary="This slice stops at the guarded reset-required shell state. The password reset submission flow is intentionally not implemented here."
    >
      <Panel className="auth-panel">
        <div className="panel-heading">
          <h2 className="panel-heading__title">Authenticated, but blocked from the main shell</h2>
          <p className="panel-heading__body">
            {user.name} is signed in with <strong>{user.email}</strong>.
          </p>
        </div>
        <StatusMessage tone="warning" title="Next auth slice required">
          Password reset submission, logout, and session expiration stay out of scope for this foundation work.
        </StatusMessage>
      </Panel>
    </AuthFrame>
  );
}
