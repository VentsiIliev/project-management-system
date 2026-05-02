import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useOutletContext,
  useParams,
} from "react-router-dom";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ResetRequiredPage } from "../../features/auth/pages/ResetRequiredPage";
import { SessionGate } from "../../features/auth/components/SessionGate";
import { type SessionUser } from "../../features/auth/types";
import { ProjectsHomePage } from "../../features/projects/pages/ProjectsHomePage";

type SessionContext = {
  session: SessionUser | null;
};

function useSessionContext() {
  return useOutletContext<SessionContext>();
}

function LoginRoute() {
  const { session } = useSessionContext();

  if (session) {
    return (
      <Navigate
        replace
        to={session.must_reset_password ? "/reset-password" : "/"}
      />
    );
  }

  return <LoginPage />;
}

function ProtectedShellRoute() {
  const { session } = useSessionContext();
  const { projectId } = useParams();

  if (!session) {
    return <Navigate replace to="/login" />;
  }

  if (session.must_reset_password) {
    return <Navigate replace to="/reset-password" />;
  }

  return <ProjectsHomePage projectId={projectId ?? null} user={session} />;
}

function ResetRequiredRoute() {
  const { session } = useSessionContext();

  if (!session) {
    return <Navigate replace to="/login" />;
  }

  if (!session.must_reset_password) {
    return <Navigate replace to="/" />;
  }

  return <ResetRequiredPage user={session} />;
}

function FallbackRoute() {
  const { session } = useSessionContext();

  if (!session) {
    return <Navigate replace to="/login" />;
  }

  return (
    <Navigate
      replace
      to={session.must_reset_password ? "/reset-password" : "/"}
    />
  );
}

function SessionLayout() {
  return (
    <SessionGate>
      {(session) => <Outlet context={{ session }} />}
    </SessionGate>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SessionLayout />} path="/">
        <Route element={<ProtectedShellRoute />} index />
        <Route element={<ProtectedShellRoute />} path="projects/:projectId" />
        <Route element={<LoginRoute />} path="login" />
        <Route element={<ResetRequiredRoute />} path="reset-password" />
        <Route element={<FallbackRoute />} path="*" />
      </Route>
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export function TestAppRouter({
  initialEntries = ["/"],
}: {
  initialEntries?: string[];
}) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>
  );
}
