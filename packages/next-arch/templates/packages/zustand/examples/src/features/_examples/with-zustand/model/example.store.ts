'use client';

/**
 * ПРИМЕР: Zustand store внутри фичи
 *
 * Где живёт: features/<name>/model/
 * Почему здесь: стейт принадлежит фиче. Другие фичи не импортируют этот store
 * напрямую — используй shared/ или прокидывай данные через props из view.
 *
 * Правило next-arch/no-cross-feature-imports: features/cart не импортирует
 * features/auth/model/*.store.ts. Вынеси общее в entities/ или shared/.
 */

import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Куда это идёт в архитектуре:
// features/<name>/model/ — клиентский стейт конкретной фичи.
// Экспортируй через features/<name>/index.ts для views/.
