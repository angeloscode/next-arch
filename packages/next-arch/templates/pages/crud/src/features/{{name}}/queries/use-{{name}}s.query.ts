'use client';

import { useQuery } from '@tanstack/react-query';

export function use{{Name}}sQuery() {
  return useQuery({
    queryKey: ['{{name}}s'],
    queryFn: async () => [{ id: '1', title: 'Demo' }],
  });
}
