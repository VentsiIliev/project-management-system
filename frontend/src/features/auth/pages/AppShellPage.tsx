import { Panel } from "../../../components/Panel";
import { type SessionUser } from "../types";

type AppShellPageProps = {
  user: SessionUser;
};

export function AppShellPage({ user }: AppShellPageProps) {
  return (
    <main className="shell">
      <div className="shell__hero">
        <div>
          <p className="eyebrow">Authenticated shell</p>
          <h1 className="shell__title">Session established</h1>
          <p className="shell__summary">
            The auth foundation is active. Broader product routes stay out of this slice until later stories land.
          </p>
        </div>
        <div className="status-pill">
          <span className="status-pill__label">Access</span>
          <strong>{user.is_admin ? "Admin" : "Standard user"}</strong>
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
          <h2 className="card-title">Auth foundation only</h2>
          <ul className="bullet-list">
            <li>Login form wired to the shared API client</li>
            <li>Session bootstrap query gates the shell</li>
            <li>Reset-required users are redirected out of the main shell</li>
          </ul>
        </Panel>
      </section>
    </main>
  );
}
