'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';
import { formatCurrency, formatDate } from '@/utils';

type Item = { id: string; estimate_number: number; status: string; execution_date: string; client_name: string; total_cost: number };

export default function DashboardPage() {
  const [showCanceled, setShowCanceled] = useState(false);
  const { data, refetch } = useApi<Item[]>(['estimates', String(showCanceled)], `/api/estimates?includeCanceled=${showCanceled}`);

  async function duplicateEstimate(id: string) {
    await fetch(`/api/estimates/${id}/duplicate`, { method: 'POST' });
    refetch();
  }

  return (
    <section className="space-y-4">
      <PageHelp text="Aqui você vê os orçamentos por status e data. Use o botão para criar, editar ou duplicar." />
      <div className="flex items-center gap-3">
        <Link href="/estimates/new" className="bg-green-600 text-white">Novo orçamento</Link>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showCanceled} onChange={(e) => setShowCanceled(e.target.checked)} /> Exibir cancelados
        </label>
      </div>

      <div className="overflow-auto rounded-lg bg-white p-3 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Nº</th><th>Cliente</th><th>Status</th><th>Execução</th><th>Total</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id} className="border-t">
                <td>{item.estimate_number}</td>
                <td>{item.client_name}</td>
                <td>{item.status}</td>
                <td>{formatDate(item.execution_date)}</td>
                <td>{formatCurrency(item.total_cost || 0)}</td>
                <td className="space-x-2 py-2">
                  <Link href={`/estimates/${item.id}`} className="bg-slate-200">Editar</Link>
                  <button onClick={() => duplicateEstimate(item.id)} className="bg-slate-200">Duplicar</button>
                  <a href={`/api/estimates/${item.id}/pdf`} target="_blank" className="bg-slate-200 px-4 py-2">PDF</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
