import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect, useState } from "react";

import { registerUnauthorizedHandler } from "../../api/client";
import { markSessionExpired } from "../../features/auth/state/authUiState";
import { sessionQueryKey } from "../../features/auth/hooks/useSessionQuery";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

type AppProvidersProps = PropsWithChildren<{
  queryClient?: QueryClient;
}>;

export function AppProviders({
  children,
  queryClient: externalQueryClient,
}: AppProvidersProps) {
  const [queryClient] = useState(() => externalQueryClient ?? createQueryClient());

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      markSessionExpired();
      queryClient.setQueryData(sessionQueryKey, null);
    });

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { createQueryClient };
