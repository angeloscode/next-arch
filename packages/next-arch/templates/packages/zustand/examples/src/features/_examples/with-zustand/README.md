# Пример: Zustand

Store живёт в `model/` внутри фичи, не в `shared/`.

## Публичный API

Добавь в `features/<name>/index.ts`:

```ts
export { useUiStore } from './model/example.store';
```

Views импортируют только через `@/features/<name>`.
