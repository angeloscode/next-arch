'use client';

/**
 * Сборка Redux store из reducers фич.
 * Добавляй reducers из features/<name>/model/ здесь.
 */

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
