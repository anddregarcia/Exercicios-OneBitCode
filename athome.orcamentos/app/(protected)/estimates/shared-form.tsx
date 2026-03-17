'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';
import type { PaymentMethod } from '@/lib/types';

type MaterialItem = { material_id?: string | null; name: string; quantity: number; unit_price: number; total_price: number };

const emptyMaterial: MaterialItem = { name: '', quantity: 1, unit_price: 0, total_price: 0 };

export default function EstimateForm({ estimateId }: { estimateId?: string }) {
  const { data: clients } = useApi<any[]>(['clients'], '/api/clients');
  const { data: materialsBase } = useApi<any[]>(['materials'], '/api/materials');
  const { data: settings } = useApi<any>(['settings'], '/api/settings');
  const { data: existing } = useApi<any>(['estimate', estimateId || 'new'], estimateId ? `/api/estimates/${estimateId}` : '/api/drafts');

  const [form, setForm] = useState<any>({
    client_name: '',
    problem_description: '',
    problem_cause: '',
    labor_cost: 0,
    payment_method: 'pix' as PaymentMethod,
    installments: null,
    execution_date: '',
    execution_time_hours: 1,
    status: 'pending',
    materials: [emptyMaterial]
  });

  useEffect(() => {
    if (existing?.draft?.data) setForm(existing.draft.data);
    if (existing?.estimate) setForm({ ...existing.estimate, client_name: existing.estimate.clients?.name, materials: existing.materials });
  }, [existing]);

  useEffect(() => {
    if (settings?.default_labor_cost && !estimateId) {
      setForm((prev: any) => ({ ...prev, labor_cost: prev.labor_cost || settings.default_labor_cost }));
    }
  }, [settings, estimateId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form })
      });
    }, 700);

    return () => clearTimeout(timeout);
  }, [form]);

  const materialsCost = useMemo(() => form.materials.reduce((acc: number, item: MaterialItem) => acc + Number(item.total_price || 0), 0), [form.materials]);
  const total = Number(form.labor_cost || 0) + materialsCost;

  function updateMaterial(index: number, patch: Partial<MaterialItem>) {
    setForm((prev: any) => {
      const next = [...prev.materials];
      next[index] = { ...next[index], ...patch };
      next[index].total_price = Number(next[index].quantity || 0) * Number(next[index].unit_price || 0);
      return { ...prev, materials: next };
    });
  }

  async function save() {
    const payload = { ...form, materials_cost: materialsCost, total_cost: total };
    const url = estimateId ? `/api/estimates/${estimateId}` : '/api/estimates';
    const method = estimateId ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (response.ok) window.location.href = '/dashboard';
  }

  return (
    <section className="space-y-4">
      <PageHelp text="Preencha os dados do orçamento. O rascunho salva automaticamente." />
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow">
        <input list="clients" placeholder="Nome do cliente" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
        <datalist id="clients">{clients?.map((c) => <option key={c.id} value={c.name} />)}</datalist>
        <textarea placeholder="Descrição detalhada do problema" value={form.problem_description} onChange={(e) => setForm({ ...form, problem_description: e.target.value })} />
        <textarea placeholder="Causa do problema" value={form.problem_cause} onChange={(e) => setForm({ ...form, problem_cause: e.target.value })} />
        <div className="space-y-2">
          {form.materials.map((item: MaterialItem, i: number) => (
            <div className="grid grid-cols-1 gap-2 rounded border p-2 md:grid-cols-4" key={i}>
              <input list="materials" placeholder="Material" value={item.name} onChange={(e) => updateMaterial(i, { name: e.target.value })} />
              <input type="number" placeholder="Qtd" value={item.quantity} onChange={(e) => updateMaterial(i, { quantity: Number(e.target.value) })} />
              <input type="number" step="0.01" placeholder="Valor unitário" value={item.unit_price} onChange={(e) => updateMaterial(i, { unit_price: Number(e.target.value) })} />
              <input readOnly value={item.total_price} />
            </div>
          ))}
          <datalist id="materials">{materialsBase?.map((m) => <option key={m.id} value={m.name} />)}</datalist>
          <button className="bg-slate-200" onClick={() => setForm({ ...form, materials: [...form.materials, emptyMaterial] })}>Adicionar material</button>
        </div>

        <input type="number" step="0.01" value={form.labor_cost} onChange={(e) => setForm({ ...form, labor_cost: Number(e.target.value) })} placeholder="Mão de obra" />
        <input readOnly value={total.toFixed(2)} />
        <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
          <option value="pix">Pix</option><option value="debit">Débito</option><option value="boleto">Boleto</option><option value="credit">Crédito</option>
        </select>
        {form.payment_method === 'credit' && <input type="number" value={form.installments || ''} onChange={(e) => setForm({ ...form, installments: Number(e.target.value) })} placeholder="Parcelas" />}
        <input type="date" value={form.execution_date || ''} onChange={(e) => setForm({ ...form, execution_date: e.target.value })} />
        <input type="number" value={form.execution_time_hours} onChange={(e) => setForm({ ...form, execution_time_hours: Number(e.target.value) })} placeholder="Horas previstas" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="pending">Pendente</option><option value="approved">Aprovado</option><option value="canceled">Cancelado</option>
        </select>
        <div className="flex gap-2">
          <button onClick={save} className="bg-green-600 text-white">Salvar orçamento</button>
          {estimateId ? <a className="bg-emerald-700 px-4 py-2 text-white" target="_blank" href={`https://wa.me/?text=${encodeURIComponent('Segue orçamento: ' + window.location.origin + '/api/estimates/' + estimateId + '/pdf')}`}>Compartilhar WhatsApp</a> : null}
        </div>
      </div>
    </section>
  );
}
