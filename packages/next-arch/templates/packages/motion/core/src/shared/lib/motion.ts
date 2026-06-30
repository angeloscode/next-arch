/**
 * ПРИМЕР: переиспользуемые Motion variants
 *
 * Где живёт: shared/lib/
 * Почему здесь: variants — дизайн-токены анимации, не бизнес-логика.
 * Компоненты фич импортируют variants отсюда.
 */

export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
} as const;

// Куда это идёт в архитектуре:
// shared/lib/motion.ts — импорт в features/<name>/components/ через @/shared/lib/motion.
