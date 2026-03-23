'use client';

import { useQuery } from '@tanstack/react-query';

export function useApi<T>(key: string[], url: string) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Erro ao carregar dados');
      return response.json();
    }
  });
}
