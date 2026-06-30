'use server';

export async function delete{{Name}}Action(id: string) {
  return { ok: true as const, id };
}
