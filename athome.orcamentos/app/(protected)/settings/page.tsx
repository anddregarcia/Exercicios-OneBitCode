'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';

const emptyFeedback = null as { type: 'success' | 'error'; message: string } | null;

export default function SettingsPage() {
  const { data } = useApi<any>(['settings'], '/api/settings');
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(emptyFeedback);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function save() {
    setSaving(true);
    setFeedback(null);

    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setSaving(false);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFeedback({ type: 'error', message: error?.error || 'Não foi possível salvar as configurações.' });
      return;
    }

    setFeedback({ type: 'success', message: 'Configurações salvas com sucesso no banco.' });
  }

  const fields = [
    { key: 'company_name', label: 'Nome da empresa' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'address', label: 'Endereço' },
    { key: 'phone', label: 'Telefone' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'pix_key', label: 'Chave PIX' },
    { key: 'bank_details', label: 'Dados bancários' },
    { key: 'logo_url', label: 'URL do logo', type: 'url' },
    { key: 'default_labor_cost', label: 'Mão de obra padrão', type: 'number' }
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="page-title">Configurações</h2>
        <p className="page-subtitle mt-2">Personalize os dados da empresa usados no PDF e no cálculo inicial de mão de obra.</p>
      </div>

      <PageHelp text="Preencha os dados da sua empresa para deixar seus PDFs e cobranças mais profissionais. Tudo é salvo automaticamente ao clicar no botão abaixo." />

      <div className="page-card space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label className="field-group" key={field.key}>
              <span className="field-label">{field.label}</span>
              <input
                type={field.type || 'text'}
                value={form[field.key] ?? (field.type === 'number' ? 0 : '')}
                onChange={(e) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
              />
            </label>
          ))}
        </div>

        {feedback ? (
          <p className={`rounded-2xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {feedback.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <button onClick={save} className="primary-button min-w-48" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      </div>
    </section>
  );
}
