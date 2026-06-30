'use client';

import { useQuery } from '@tanstack/react-query';
import { loginAction } from '../actions/login.action';

export function useUserQuery(email: string | null) {
  return useQuery({
    queryKey: ['user', email],
    enabled: Boolean(email),
    queryFn: async () => {
      if (!email) return null;
      const result = await loginAction({ email, password: 'demo' });
      return result.ok ? result : null;
    },
  });
}
