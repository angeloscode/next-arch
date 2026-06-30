'use client';

import { useQuery } from '@tanstack/react-query';

export function use{{Name}}Query(id: string) {
  return useQuery({
    queryKey: ['{{name}}', id],
    queryFn: async () => ({ id, title: 'Demo' }),
  });
}
