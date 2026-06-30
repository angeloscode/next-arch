'use server';

export async function create{{Name}}Action(data: { title: string }) {
  return { ok: true as const, id: '1', ...data };
}
