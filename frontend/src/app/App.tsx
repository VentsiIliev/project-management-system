import { AppProviders } from "./providers/AppProviders";
import { AppRouter } from "./router/createAppRouter";

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
