'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';
import { formatCurrency } from '@/utils';
import type { PaymentMethod } from '@/lib/types';

type MaterialItem = { material_id?: string | null; name: string; quantity: number; unit_price: number; total_price: number };

const emptyMaterial = (): MaterialItem => ({ name: '', quantity: 1, unit_price: 0, total_price: 0 });

const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: 'Pix',
  debit: 'Débito',
  boleto: 'Boleto',
  credit: 'Crédito'
};

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
    materials: [emptyMaterial()]
  });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (existing?.draft?.data && !estimateId) {
      setForm({ ...existing.draft.data, materials: existing.draft.data.materials?.length ? existing.draft.data.materials : [emptyMaterial()] });
    }

    if (existing?.estimate) {
      setForm({
        ...existing.estimate,
        client_name: existing.estimate.clients?.name,
        materials: existing.materials?.length ? existing.materials : [emptyMaterial()]
      });
    }
  }, [existing, estimateId]);

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
      }).catch(() => null);
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

  function removeMaterial(index: number) {
    setForm((prev: any) => {
      const next = prev.materials.filter((_: MaterialItem, currentIndex: number) => currentIndex !== index);
      return { ...prev, materials: next.length ? next : [emptyMaterial()] };
    });
  }

  function handleMaterialNameChange(index: number, value: string) {
    const matched = materialsBase?.find((material) => material.name.toLowerCase() === value.trim().toLowerCase());
    updateMaterial(index, {
      name: value,
      material_id: matched?.id || null,
      unit_price: matched ? Number(matched.default_price) : form.materials[index].unit_price
    });
  }

  async function save() {
    setSaveState('saving');
    setSaveMessage('Salvando orçamento...');

    const payload = {
      ...form,
      client_name: form.client_name?.trim(),
      problem_description: form.problem_description?.trim(),
      problem_cause: form.problem_cause?.trim(),
      materials: form.materials.filter((item: MaterialItem) => item.name.trim()),
      materials_cost: materialsCost,
      total_cost: total
    };

    const url = estimateId ? `/api/estimates/${estimateId}` : '/api/estimates';
    const method = estimateId ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setSaveState('error');
      setSaveMessage(error?.error || 'Não foi possível salvar o orçamento.');
      return;
    }

    setSaveState('success');
    setSaveMessage('Orçamento salvo com sucesso no banco.');
    window.location.href = '/dashboard';
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="page-title">{estimateId ? 'Editar orçamento' : 'Novo orçamento'}</h2>
        <p className="page-subtitle mt-2">Monte um orçamento completo com cliente, diagnóstico, materiais, forma de pagamento e totais.</p>
      </div>

      <PageHelp text="Preencha os dados do orçamento com calma. O rascunho segue sendo salvo automaticamente enquanto você digita." />

      <div className="page-card space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-group md:col-span-2">
            <span className="field-label">Cliente</span>
            <input list="clients" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            <span className="field-hint">Você pode selecionar um cliente existente ou digitar um novo nome.</span>
          </label>
          <datalist id="clients">{clients?.map((c) => <option key={c.id} value={c.name} />)}</datalist>

          <label className="field-group md:col-span-2">
            <span className="field-label">Descrição do problema</span>
            <textarea value={form.problem_description} onChange={(e) => setForm({ ...form, problem_description: e.target.value })} />
          </label>

          <label className="field-group md:col-span-2">
            <span className="field-label">Causa do problema</span>
            <textarea value={form.problem_cause} onChange={(e) => setForm({ ...form, problem_cause: e.target.value })} />
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Materiais do orçamento</h3>
              <p className="text-sm text-slate-500">Adicione, altere ou remova materiais conforme a necessidade do serviço.</p>
            </div>
            <button className="secondary-button" onClick={() => setForm({ ...form, materials: [...form.materials, emptyMaterial()] })}>
              + Adicionar material
            </button>
          </div>

          <div className="space-y-4">
            {form.materials.map((item: MaterialItem, i: number) => (
              <div key={`${i}-${item.name}`} className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_160px_180px_180px_auto] md:items-end">
                  <label className="field-group">
                    <span className="field-label">Material</span>
                    <input list="materials" value={item.name} onChange={(e) => handleMaterialNameChange(i, e.target.value)} />
                  </label>

                  <label className="field-group">
                    <span className="field-label">Quantidade</span>
                    <input type="number" min="0" step="1" value={item.quantity} onChange={(e) => updateMaterial(i, { quantity: Number(e.target.value) })} />
                  </label>

                  <label className="field-group">
                    <span className="field-label">Valor unitário</span>
                    <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateMaterial(i, { unit_price: Number(e.target.value) })} />
                  </label>

                  <label className="field-group">
                    <span className="field-label">Total do material</span>
                    <input readOnly value={formatCurrency(item.total_price || 0)} />
                  </label>

                  <button className="danger-button md:mb-0.5" onClick={() => removeMaterial(i)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <datalist id="materials">{materialsBase?.map((m) => <option key={m.id} value={m.name} />)}</datalist>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="field-group">
            <span className="field-label">Mão de obra</span>
            <input type="number" min="0" step="0.01" value={form.labor_cost} onChange={(e) => setForm({ ...form, labor_cost: Number(e.target.value) })} />
          </label>

          <label className="field-group">
            <span className="field-label">Total dos materiais</span>
            <input readOnly value={formatCurrency(materialsCost)} />
          </label>

          <label className="field-group">
            <span className="field-label">Total geral</span>
            <input readOnly value={formatCurrency(total)} />
          </label>

          <label className="field-group">
            <span className="field-label">Tempo estimado (horas)</span>
            <input type="number" min="0" value={form.execution_time_hours} onChange={(e) => setForm({ ...form, execution_time_hours: Number(e.target.value) })} />
          </label>

          <label className="field-group">
            <span className="field-label">Forma de pagamento</span>
            <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value, installments: e.target.value === 'credit' ? form.installments : null })}>
              {Object.entries(paymentMethodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {form.payment_method === 'credit' ? (
            <label className="field-group">
              <span className="field-label">Parcelas</span>
              <input type="number" min="1" value={form.installments || ''} onChange={(e) => setForm({ ...form, installments: Number(e.target.value) })} />
            </label>
          ) : null}

          <label className="field-group">
            <span className="field-label">Data de execução</span>
            <input type="date" value={form.execution_date || ''} onChange={(e) => setForm({ ...form, execution_date: e.target.value })} />
          </label>

          <label className="field-group">
            <span className="field-label">Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="canceled">Cancelado</option>
            </select>
          </label>
        </div>

        {saveMessage ? (
          <p className={`rounded-2xl px-4 py-3 text-sm ${saveState === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {saveMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Resumo:</span> materiais {formatCurrency(materialsCost)} + mão de obra {formatCurrency(Number(form.labor_cost || 0))}.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={save} className="primary-button" disabled={saveState === 'saving'}>
              {saveState === 'saving' ? 'Salvando...' : 'Salvar orçamento'}
            </button>
            {estimateId ? (
              <a className="secondary-button" target="_blank" href={`https://wa.me/?text=${encodeURIComponent('Segue orçamento: ' + window.location.origin + '/api/estimates/' + estimateId + '/pdf')}`}>
                Compartilhar WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
