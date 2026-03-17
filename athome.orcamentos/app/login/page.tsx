'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setError('Não foi possível entrar. Verifique email e senha.');
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <main className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Entrar no AtHome Orçamentos</h1>
      <p className="mb-4 text-sm text-slate-600">Use seu usuário liberado no Supabase.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full bg-slate-900 text-white">Entrar</button>
      </form>
    </main>
  );
}
