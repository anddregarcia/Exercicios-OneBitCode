'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!response.ok) {
      setError('Não foi possível entrar. Verifique email e senha.');
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/15 bg-slate-950/80 shadow-[0_30px_100px_-30px_rgba(2,6,23,0.85)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-10 text-slate-950 md:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em]">AtHome</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">Seus orçamentos com aparência profissional e fluxo mais ágil.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-900/80">
            Centralize clientes, materiais e propostas em um painel moderno para sua rotina de manutenção residencial.
          </p>
          <div className="mt-10 space-y-4 text-sm font-medium text-slate-900/80">
            <div className="rounded-2xl bg-white/40 p-4">✔ Cadastro organizado com campos claros e salvos no banco.</div>
            <div className="rounded-2xl bg-white/40 p-4">✔ Orçamentos com materiais, totais e ações rápidas.</div>
            <div className="rounded-2xl bg-white/40 p-4">✔ Navegação lateral para acessar tudo com menos cliques.</div>
          </div>
        </section>

        <section className="bg-white p-6 text-slate-900 md:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Acesso</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Entrar no AtHome Orçamentos</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Use seu usuário autorizado no Supabase para acessar a área protegida.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <label className="field-group">
                <span className="field-label">Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>

              <label className="field-group">
                <span className="field-label">Senha</span>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
              </label>

              {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

              <button className="primary-button w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
