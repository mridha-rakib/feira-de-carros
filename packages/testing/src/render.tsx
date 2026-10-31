import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, type RenderResult, render as rtlRender } from '@testing-library/react';
import type * as React from 'react';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions,
): RenderResult & { queryClient: QueryClient } {
  const testQueryClient = options?.queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
    queryClient: testQueryClient,
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
