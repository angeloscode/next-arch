'use client';

/**
 * ПРИМЕР: Jotai atoms внутри фичи
 *
 * Где живёт: features/<name>/model/
 * Атомарный стейт — альтернатива Zustand для мелкого гранулярного стейта.
 */

import { atom } from 'jotai';

export const sidebarOpenAtom = atom(true);

export const toggleSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, !get(sidebarOpenAtom));
});

// Куда это идёт в архитектуре:
// features/<name>/model/ — атомы принадлежат фиче.
