'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds for admin real-time data
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
          const err = error as { statusCode?: number } | undefined;
          if (err?.statusCode === 401 || err?.statusCode === 403) return false;
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
