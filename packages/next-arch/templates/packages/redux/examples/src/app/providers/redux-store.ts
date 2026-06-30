'use client';

/**
 * ПРИМЕР: Redux store с reducer из фичи-примера.
 * Перезаписывает app/providers/redux-store.ts при генерации примеров.
 */

import { configureStore } from '@reduxjs/toolkit';
import { exampleReducer } from '@/features/_examples/with-redux/model/example.slice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
