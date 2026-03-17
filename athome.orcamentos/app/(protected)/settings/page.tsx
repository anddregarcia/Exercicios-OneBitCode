'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';

export default function SettingsPage() {
  const { data } = useApi<any>(['settings'], '/api/settings');
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save() {
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    alert('Configurações salvas');
  }

  return (
    <section className="space-y-4">
      <PageHelp text="Configure seus dados para preencher o cabeçalho do PDF automaticamente." />
      <div className="grid gap-2 rounded bg-white p-4 shadow md:grid-cols-2">
        <input placeholder="Nome da empresa" value={form.company_name || ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        <input placeholder="CNPJ" value={form.cnpj || ''} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
        <input placeholder="Endereço" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Telefone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Instagram" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        <input placeholder="Chave PIX" value={form.pix_key || ''} onChange={(e) => setForm({ ...form, pix_key: e.target.value })} />
        <input placeholder="Dados bancários" value={form.bank_details || ''} onChange={(e) => setForm({ ...form, bank_details: e.target.value })} />
        <input placeholder="URL do logo" value={form.logo_url || ''} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
        <input type="number" placeholder="Mão de obra padrão" value={form.default_labor_cost || 0} onChange={(e) => setForm({ ...form, default_labor_cost: Number(e.target.value) })} />
      </div>
      <button onClick={save} className="bg-slate-900 text-white">Salvar configurações</button>
    </section>
  );
}
