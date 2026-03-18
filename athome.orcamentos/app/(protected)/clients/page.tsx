'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';

export default function ClientsPage() {
  const { data, refetch } = useApi<any[]>(['clients'], '/api/clients');
  const [name, setName] = useState('');

  async function addClient() {
    await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    setName('');
    refetch();
  }

  async function remove(id: string) {
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
    refetch();
  }

  return (
    <section className="space-y-4">
      <PageHelp text="Cadastre e edite clientes. Endereço e contatos são opcionais." />
      <div className="rounded bg-white p-4 shadow">
        <div className="mb-3 flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do cliente" /><button className="bg-slate-900 text-white" onClick={addClient}>Salvar</button></div>
        <ul className="space-y-2">{data?.map((c) => <li key={c.id} className="flex items-center justify-between border-b py-2"><span>{c.name}</span><button className="bg-red-100" onClick={() => remove(c.id)}>Excluir</button></li>)}</ul>
      </div>
    </section>
  );
}
