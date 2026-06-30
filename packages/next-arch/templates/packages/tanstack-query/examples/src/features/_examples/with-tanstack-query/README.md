# Пример: TanStack Query

Папку `_examples` можно удалить после изучения.

## Структура

- `queries/` — клиентские хуки с кешем (`useQuery`, `useMutation`)
- `actions/` — Server Actions, источник данных на сервере

## Как перенести в свою фичу

```bash
npx @yousxlfs/next-arch g feature billing
```

Скопируй паттерн в `src/features/billing/queries/` и `actions/`.

## Подключение провайдера

В `src/app/layout.tsx`:

```tsx
import { QueryProvider } from '@/shared/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```
