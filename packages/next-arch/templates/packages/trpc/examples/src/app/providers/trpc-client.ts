'use client';

/**
 * ПРИМЕР: tRPC React client
 *
 * Где живёт: app/providers/
 * app — верхний слой, может импортировать типы роутера из app/api/.
 */

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/app/api/trpc/router';

export const trpc = createTRPCReact<AppRouter>();
