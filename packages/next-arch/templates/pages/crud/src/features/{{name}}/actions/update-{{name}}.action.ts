'use server';

export async function update{{Name}}Action(id: string, data: { title: string }) {
  return { ok: true as const, id, ...data };
}
