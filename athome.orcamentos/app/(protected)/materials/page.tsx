'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { PageHelp } from '@/components/page-help';

export default function MaterialsPage() {
  const { data, refetch } = useApi<any[]>(['materials'], '/api/materials');
  const [name, setName] = useState('');
  const [defaultPrice, setDefaultPrice] = useState(0);

  async function add() {
    await fetch('/api/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, default_price: defaultPrice }) });
    setName(''); setDefaultPrice(0); refetch();
  }

  async function remove(id: string) {
    await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
    refetch();
  }

  return (
    <section className="space-y-4">
      <PageHelp text="Cadastre materiais e valor padrão. O valor será usado no orçamento." />
      <div className="rounded bg-white p-4 shadow">
        <div className="mb-3 grid gap-2 md:grid-cols-3"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Material" /><input type="number" value={defaultPrice} onChange={(e) => setDefaultPrice(Number(e.target.value))} /><button className="bg-slate-900 text-white" onClick={add}>Salvar</button></div>
        <ul className="space-y-2">{data?.map((m) => <li key={m.id} className="flex items-center justify-between border-b py-2"><span>{m.name} - R$ {Number(m.default_price).toFixed(2)}</span><button className="bg-red-100" onClick={() => remove(m.id)}>Excluir</button></li>)}</ul>
      </div>
    </section>
  );
}
