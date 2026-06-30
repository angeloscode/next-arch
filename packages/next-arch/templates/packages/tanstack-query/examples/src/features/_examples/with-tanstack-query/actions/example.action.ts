'use server';

/**
 * ПРИМЕР: Server Action как источник данных для TanStack Query
 *
 * Где живёт: features/<name>/actions/
 * Почему здесь: actions выполняются на сервере (мутации, fetch с секретами).
 * Query-хук в queries/ вызывает action и кеширует результат на клиенте.
 *
 * Правило: не импортируй server actions напрямую в UI-компоненты для чтения —
 * оборачивай в useQuery/useMutation.
 */

export interface ExampleData {
  id: string;
  title: string;
}

export async function fetchExampleAction(): Promise<
  { ok: true; data: ExampleData } | { ok: false; error: string }
> {
  // В реальном проекте здесь будет запрос к БД или внешнему API
  return {
    ok: true,
    data: {
      id: '1',
      title: 'Пример данных с сервера',
    },
  };
}

// Куда это идёт в архитектуре:
// features/<name>/actions/ — серверный слой фичи.
// Вызывается из queries/ той же фичи, не из views/ напрямую.
