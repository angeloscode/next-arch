'use client';

/**
 * ПРИМЕР: TanStack Query в архитектуре next-arch
 *
 * Где живёт: features/<name>/queries/
 * Почему здесь: queries — клиентский кеш серверных данных.
 * Они принадлежат конкретной фиче и не выносятся в shared/.
 *
 * Правило: Server Actions делают мутации (actions/),
 * TanStack Query кеширует и синхронизирует данные (queries/).
 * Никогда не смешивай их ответственности.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchExampleAction } from '../actions/example.action';

const EXAMPLE_QUERY_KEY = ['example'] as const;

export function useExampleQuery() {
  return useQuery({
    queryKey: EXAMPLE_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchExampleAction();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      return { message, updatedAt: new Date().toISOString() };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEY });
    },
  });
}

// Куда это идёт в архитектуре:
// features/_examples/with-tanstack-query/queries/ — клиентский слой фичи.
// Импортирует action из ../actions/ (та же фича, относительный путь — OK).
// В реальном проекте замени _examples на свою фичу, например features/billing/queries/.
