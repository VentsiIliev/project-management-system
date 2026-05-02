import { type PropsWithChildren } from "react";

import { Button } from "../../../components/Button";
import { Panel } from "../../../components/Panel";
import { useLogoutMutation } from "../hooks/useLogoutMutation";
import { type SessionUser } from "../types";

type AppShellPageProps = PropsWithChildren<{
  user: SessionUser;
}>;

export function AppShellPage({ children, user }: AppShellPageProps) {
  const logoutMutation = useLogoutMutation();

  return (
    <main className="shell">
      <div className="shell__hero">
        <div>
          <p className="eyebrow">Project workspace</p>
          <h1 className="shell__title">Create and seed project spaces</h1>
          <p className="shell__summary">
            The authenticated shell now hosts the first project workflow. Use it to create project records, validate
            date rules, and confirm the backend permission path from the signed-in account.
          </p>
        </div>
        <div className="status-pill">
          <span className="status-pill__label">Access</span>
          <strong>{user.is_admin ? "Admin" : "Authenticated user"}</strong>
        </div>
      </div>

      <section className="shell__grid">
        <Panel>
          <p className="card-kicker">Signed in as</p>
          <h2 className="card-title">{user.name}</h2>
          <dl className="details-list">
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{user.id}</dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <p className="card-kicker">Current scope</p>
          <h2 className="card-title">Project creation slice</h2>
          <ul className="bullet-list">
            <li>Project records can be created through the protected API</li>
            <li>Duplicate codes and invalid date ranges return structured errors</li>
            <li>Team-member level accounts are denied by the backend permission rule</li>
          </ul>
          <Button
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            type="button"
            variant="secondary"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </Panel>
      </section>

      {children ? <section className="shell__workspace">{children}</section> : null}
    </main>
  );
}
