'use client';

import { useQuery } from '@tanstack/react-query';

export function useApi<T>(key: string[], url?: string | null) {
  return useQuery<T>({
    queryKey: key,
    enabled: Boolean(url),
    queryFn: async () => {
      if (!url) {
        throw new Error('URL da API não informada');
      }

      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Erro ao carregar dados');
      return response.json();
    }
  });
}
