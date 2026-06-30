'use server';

import type { RegisterInput } from '../types/auth.types';

export async function registerAction(input: RegisterInput) {
  return { ok: true as const, userId: 'demo', email: input.email };
}
