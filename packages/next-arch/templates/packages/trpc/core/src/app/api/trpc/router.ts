/**
 * ПРИМЕР: tRPC router (заглушка)
 *
 * Где живёт: app/api/trpc/ или отдельный backend.
 * В FSD клиентские хуки tRPC — в features/<name>/queries/.
 */

import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure.query(() => ({ message: 'Привет из tRPC' })),
});

export type AppRouter = typeof appRouter;

// Куда это идёт в архитектуре:
// Серверный роутер — app/api или packages/server. Не в shared/.
