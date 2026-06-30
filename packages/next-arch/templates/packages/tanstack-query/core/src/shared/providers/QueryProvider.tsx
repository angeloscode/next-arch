'use client';

/**
 * ПРИМЕР: провайдер TanStack Query для Next.js App Router
 *
 * Где живёт: shared/providers/
 * Почему здесь: провайдер — инфраструктурная обёртка, не привязана к фиче.
 * Подключается один раз в app/layout.tsx.
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { queryClient } from '@/shared/lib/query-client';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Куда это идёт в архитектуре:
// shared/providers/ → импортируется в app/layout.tsx (слой app, только композиция).
