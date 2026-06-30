'use client';

/**
 * ПРИМЕР: Motion в компоненте фичи
 */

import { motion } from 'motion/react';
import { fadeIn } from '@/shared/lib/motion';

export function ExampleMotionCard() {
  return (
    <motion.div {...fadeIn} className="rounded-xl border p-6">
      Анимированная карточка
    </motion.div>
  );
}

// Куда это идёт в архитектуре:
// features/<name>/components/
