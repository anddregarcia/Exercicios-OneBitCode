'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';
import { formatCurrency, formatDate } from '@/utils';

type Item = { id: string; estimate_number: number; status: string; execution_date: string; client_name: string; total_cost: number };

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  canceled: 'Cancelado'
};

const statusClasses: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  canceled: 'bg-rose-100 text-rose-700'
};

export default function DashboardPage() {
  const [showCanceled, setShowCanceled] = useState(false);
  const { data, refetch } = useApi<Item[]>(['estimates', String(showCanceled)], `/api/estimates?includeCanceled=${showCanceled}`);

  async function duplicateEstimate(id: string) {
    await fetch(`/api/estimates/${id}/duplicate`, { method: 'POST' });
    refetch();
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="page-title">Orçamentos</h2>
          <p className="page-subtitle mt-2">Acompanhe seus orçamentos, filtre os cancelados e acesse as ações principais em poucos cliques.</p>
        </div>
        <Link href="/estimates/new" className="primary-button">
          + Novo orçamento
        </Link>
      </div>

      <PageHelp text="Visualize rapidamente os totais, o status de cada orçamento e abra edição, duplicação ou PDF a partir desta tela." />

      <div className="page-card space-y-6">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={showCanceled} onChange={(e) => setShowCanceled(e.target.checked)} className="h-4 w-4 rounded border-slate-300 p-0" />
          Exibir orçamentos cancelados
        </label>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <div className="hidden grid-cols-[90px_1.2fr_140px_140px_140px_220px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <span>Nº</span>
            <span>Cliente</span>
            <span>Status</span>
            <span>Execução</span>
            <span>Total</span>
            <span>Ações</span>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.length ? (
              data.map((item) => (
                <div key={item.id} className="grid gap-4 px-5 py-4 md:grid-cols-[90px_1.2fr_140px_140px_140px_220px] md:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Número</p>
                    <p className="font-semibold text-slate-900">#{item.estimate_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Cliente</p>
                    <p className="font-medium text-slate-800">{item.client_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Status</p>
                    <span className={`status-badge ${statusClasses[item.status] || 'bg-slate-100 text-slate-700'}`}>{statusLabels[item.status] || item.status}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Execução</p>
                    <p className="text-sm text-slate-700">{formatDate(item.execution_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Total</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(item.total_cost || 0)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/estimates/${item.id}`} className="secondary-button px-4 py-2 text-xs md:text-sm">
                      Editar
                    </Link>
                    <button onClick={() => duplicateEstimate(item.id)} className="secondary-button px-4 py-2 text-xs md:text-sm">
                      Duplicar
                    </button>
                    <a href={`/api/estimates/${item.id}/pdf`} target="_blank" className="secondary-button px-4 py-2 text-xs md:text-sm">
                      PDF
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-slate-500">Nenhum orçamento encontrado.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
