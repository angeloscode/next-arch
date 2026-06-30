'use client';

/**
 * ПРИМЕР: Redux Provider для Next.js
 *
 * Где живёт: shared/providers/
 * Подключи в app/layout.tsx. Reducers фич регистрируй в app/providers/store.ts
 * (слой app может импортировать features — это разрешено).
 */

import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from '@/app/providers/redux-store';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

// Куда это идёт в архитектуре:
// shared/providers/ → app/layout.tsx
