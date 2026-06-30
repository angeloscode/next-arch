/**
 * ПРИМЕР: глобальный QueryClient для TanStack Query
 *
 * Где живёт: shared/lib/
 * Почему здесь: QueryClient — инфраструктура, не бизнес-логика.
 * Один экземпляр на всё приложение, переиспользуется всеми фичами.
 *
 * Правило: фичи импортируют queryClient отсюда, но queries/mutations
 * объявляют внутри своей фичи (features/<name>/queries/).
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Куда это идёт в архитектуре:
// shared/lib/ — слой shared, доступен всем верхним слоям (entities → features → views → app).
