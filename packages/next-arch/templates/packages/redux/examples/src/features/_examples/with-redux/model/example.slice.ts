'use client';

/**
 * ПРИМЕР: Redux Toolkit slice внутри фичи
 *
 * Где живёт: features/<name>/model/
 * Почему здесь: Redux slice = стейт конкретной фичи.
 * Глобальный store собирается в shared/lib/store.ts из slices фич.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  count: number;
}

const initialState: ExampleState = { count: 0 };

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
  },
});

export const { increment, setCount } = exampleSlice.actions;
export const exampleReducer = exampleSlice.reducer;

// Куда это идёт в архитектуре:
// features/<name>/model/ — reducer регистрируется в shared/lib/store.ts.
