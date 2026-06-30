'use client';

/**
 * ПРИМЕР: TanStack Form + Zod в фиче
 *
 * Где живёт: features/<name>/components/ (или ui/)
 * Форма — UI с логикой ввода, принадлежит фиче.
 * Схема валидации — entities/<entity>/lib/ или types/ фичи.
 */

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const exampleSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

type ExampleFormValues = z.infer<typeof exampleSchema>;

export function ExampleForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' } satisfies ExampleFormValues,
    onSubmit: async ({ value }) => {
      const parsed = exampleSchema.safeParse(value);
      if (!parsed.success) return;
      // Вызов Server Action из features/<name>/actions/
      console.log(parsed.data);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4 max-w-sm"
    >
      <form.Field name="email">
        {(field) => (
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              className="rounded border px-3 py-2"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
      <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Отправить
      </button>
    </form>
  );
}

// Куда это идёт в архитектуре:
// features/<name>/components/ — UI фичи. View импортирует форму через @/features/<name>.
