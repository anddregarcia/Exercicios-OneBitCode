'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';
import { formatCurrency } from '@/utils';

export default function MaterialsPage() {
  const { data, refetch } = useApi<any[]>(['materials'], '/api/materials');
  const [name, setName] = useState('');
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function add() {
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Informe o nome do material.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), default_price: defaultPrice })
    });

    setSaving(false);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFeedback({ type: 'error', message: error?.error || 'Não foi possível salvar o material.' });
      return;
    }

    setName('');
    setDefaultPrice(0);
    setFeedback({ type: 'success', message: 'Material salvo com sucesso no banco.' });
    refetch();
  }

  async function saveEdit() {
    if (!editingId) return;

    const response = await fetch('/api/materials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name: editingName.trim(), default_price: editingPrice })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFeedback({ type: 'error', message: error?.error || 'Não foi possível editar o material.' });
      return;
    }

    setEditingId(null);
    setEditingName('');
    setEditingPrice(0);
    setFeedback({ type: 'success', message: 'Material atualizado com sucesso.' });
    refetch();
  }

  async function remove(id: string) {
    await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
    setFeedback({ type: 'success', message: 'Material removido com sucesso.' });
    refetch();
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="page-title">Materiais</h2>
        <p className="page-subtitle mt-2">Monte uma base de materiais reutilizável para agilizar a criação dos orçamentos.</p>
      </div>

      <PageHelp text="Cadastre materiais com valor padrão. Eles aparecem na criação do orçamento e podem ser reutilizados depois." />

      <div className="page-card space-y-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.6fr)_auto] md:items-end">
          <label className="field-group">
            <span className="field-label">Nome do material</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="field-group">
            <span className="field-label">Valor padrão</span>
            <input type="number" min="0" step="0.01" value={defaultPrice} onChange={(e) => setDefaultPrice(Number(e.target.value))} />
          </label>

          <button className="primary-button md:min-w-40" onClick={add} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar material'}
          </button>
        </div>

        {feedback ? (
          <p className={`rounded-2xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {feedback.message}
          </p>
        ) : null}

        <div className="grid gap-3">
          {data?.length ? (
            data.map((m) => {
              const isEditing = editingId === m.id;

              return (
                <div key={m.id} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="w-full">
                    {isEditing ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="field-group">
                          <span className="field-label">Nome do material</span>
                          <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                        </label>

                        <label className="field-group">
                          <span className="field-label">Valor padrão</span>
                          <input type="number" min="0" step="0.01" value={editingPrice} onChange={(e) => setEditingPrice(Number(e.target.value))} />
                        </label>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-900">{m.name}</p>
                        <p className="text-sm text-slate-500">Valor padrão: {formatCurrency(Number(m.default_price) || 0)}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {isEditing ? (
                      <>
                        <button className="icon-action-button" onClick={saveEdit} title="Salvar material" aria-label="Salvar material">
                          💾
                        </button>
                        <button
                          className="icon-action-button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName('');
                            setEditingPrice(0);
                          }}
                          title="Cancelar edição"
                          aria-label="Cancelar edição"
                        >
                          ↩️
                        </button>
                      </>
                    ) : (
                      <button
                        className="icon-action-button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditingName(m.name);
                          setEditingPrice(Number(m.default_price) || 0);
                          setFeedback(null);
                        }}
                        title="Editar material"
                        aria-label="Editar material"
                      >
                        ✏️
                      </button>
                    )}

                    <button className="icon-action-button-danger" onClick={() => remove(m.id)} title="Excluir material" aria-label="Excluir material">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
              Nenhum material cadastrado ainda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
