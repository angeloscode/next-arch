'use client';

import { useCallback, useState } from 'react';
import type { Session } from '../types/auth.types';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  const setDemoSession = useCallback((value: Session | null) => {
    setSession(value);
  }, []);

  return { session, setDemoSession, isAuthenticated: Boolean(session) };
}
