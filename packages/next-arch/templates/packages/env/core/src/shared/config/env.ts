/**
 * ПРИМЕР: типизированные переменные окружения
 *
 * Где живёт: shared/config/
 * Почему здесь: env — конфигурация приложения, не бизнес-логика.
 * Валидируй один раз при старте, используй везде с типами.
 */

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

// Куда это идёт в архитектуре:
// shared/config/ — доступен всем слоям. Не дублируй process.env в фичах.
