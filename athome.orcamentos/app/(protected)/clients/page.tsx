'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';

export default function ClientsPage() {
  const { data, refetch } = useApi<any[]>(['clients'], '/api/clients');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function addClient() {
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Informe o nome do cliente para salvar.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() })
    });

    setSaving(false);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFeedback({ type: 'error', message: error?.error || 'Não foi possível salvar o cliente.' });
      return;
    }

    setName('');
    setFeedback({ type: 'success', message: 'Cliente salvo com sucesso no banco.' });
    refetch();
  }

  async function saveEdit() {
    if (!editingId) return;

    const response = await fetch('/api/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name: editingName.trim() })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFeedback({ type: 'error', message: error?.error || 'Não foi possível editar o cliente.' });
      return;
    }

    setEditingId(null);
    setEditingName('');
    setFeedback({ type: 'success', message: 'Cliente atualizado com sucesso.' });
    refetch();
  }

  async function remove(id: string) {
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
    setFeedback({ type: 'success', message: 'Cliente removido com sucesso.' });
    refetch();
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="page-title">Clientes</h2>
        <p className="page-subtitle mt-2">Cadastre, edite e mantenha sua base de clientes atualizada com uma interface pronta para uso diário.</p>
      </div>

      <PageHelp text="Cadastre e mantenha sua base de clientes atualizada. O nome é obrigatório e os dados são persistidos no banco." />

      <div className="page-card space-y-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="field-group">
            <span className="field-label">Nome do cliente</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <span className="field-hint">Use o nome completo ou razão social para facilitar a busca depois.</span>
          </label>

          <button className="primary-button md:min-w-40" onClick={addClient} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar cliente'}
          </button>
        </div>

        {feedback ? (
          <p className={`rounded-2xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {feedback.message}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-[24px] border border-slate-200">
          <ul className="divide-y divide-slate-100">
            {data?.length ? (
              data.map((c) => {
                const isEditing = editingId === c.id;

                return (
                  <li key={c.id} className="flex flex-col gap-3 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="w-full">
                      {isEditing ? (
                        <label className="field-group">
                          <span className="field-label">Nome do cliente</span>
                          <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                        </label>
                      ) : (
                        <>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          <p className="text-sm text-slate-500">Cliente disponível para vincular a novos orçamentos.</p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        <>
                          <button className="secondary-button" onClick={saveEdit}>
                            Salvar
                          </button>
                          <button
                            className="secondary-button"
                            onClick={() => {
                              setEditingId(null);
                              setEditingName('');
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditingName(c.name);
                            setFeedback(null);
                          }}
                        >
                          Editar
                        </button>
                      )}

                      <button className="danger-button" onClick={() => remove(c.id)}>
                        Excluir
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="bg-white px-5 py-8 text-center text-sm text-slate-500">Nenhum cliente cadastrado ainda.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
