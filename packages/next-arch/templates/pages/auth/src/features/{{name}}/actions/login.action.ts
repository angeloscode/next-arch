'use server';

import type { LoginInput } from '../types/auth.types';

export async function loginAction(input: LoginInput) {
  return { ok: true as const, userId: 'demo', email: input.email };
}
