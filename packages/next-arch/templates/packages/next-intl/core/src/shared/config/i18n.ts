/**
 * ПРИМЕР: next-intl конфиг
 *
 * Где живёт: shared/config/ или корень проекта (i18n.ts)
 * Следуй гайду next-intl для App Router.
 */

export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';
