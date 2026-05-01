import { render } from "@testing-library/react";

import { AppProviders, createQueryClient } from "../app/providers/AppProviders";
import { TestAppRouter } from "../app/router/createAppRouter";

type RenderAppOptions = {
  cookie?: string;
};

export function renderApp(
  initialEntries: string[] = ["/"],
  options: RenderAppOptions = {},
) {
  const queryClient = createQueryClient();

  if (options.cookie) {
    document.cookie = options.cookie;
  }

  return render(
    <AppProviders queryClient={queryClient}>
      <TestAppRouter initialEntries={initialEntries} />
    </AppProviders>,
  );
}
