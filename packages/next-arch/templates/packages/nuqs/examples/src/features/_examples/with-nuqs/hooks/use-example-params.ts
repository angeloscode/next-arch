'use client';

/**
 * ПРИМЕР: nuqs — type-safe searchParams
 *
 * Где живёт: features/<name>/hooks/
 * URL-стейт привязан к фиче (фильтры, пагинация списка).
 */

import { parseAsInteger, useQueryState } from 'nuqs';

export function useExampleParams() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return { page, setPage };
}

// Куда это идёт в архитектуре:
// features/<name>/hooks/ — view использует хук через публичный API фичи.
