"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink, httpLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { api } from "../../server/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.APP_URL) return process.env.APP_URL;
  return "http://localhost:3001";
}

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000, refetchOnWindowFocus: false } }
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error)
        }),
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
          maxURLLength: 10000000,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include"
            });
          }
        })
      ],
      transformer: superjson
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </api.Provider>
  );
};
