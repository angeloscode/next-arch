'use client';

/**
 * ПРИМЕР: React Hook Form + Zod
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const exampleSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type ExampleFormValues = z.infer<typeof exampleSchema>;

export function ExampleRhfForm() {
  const { register, handleSubmit } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4 max-w-sm">
      <input className="rounded border px-3 py-2" {...register('email')} placeholder="Email" />
      <input
        className="rounded border px-3 py-2"
        type="password"
        {...register('password')}
        placeholder="Password"
      />
      <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Отправить
      </button>
    </form>
  );
}

// Куда это идёт в архитектуре:
// features/<name>/components/
