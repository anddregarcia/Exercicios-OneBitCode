'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Orçamentos', icon: '📋' },
  { href: '/clients', label: 'Clientes', icon: '👥' },
  { href: '/materials', label: 'Materiais', icon: '🧰' },
  { href: '/settings', label: 'Configurações', icon: '⚙️' }
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell md:flex">
      <aside className="border-b border-white/10 bg-slate-950/95 px-5 py-6 text-white shadow-2xl shadow-slate-950/30 backdrop-blur md:sticky md:top-0 md:flex md:min-h-screen md:w-80 md:flex-col md:border-b-0 md:border-r md:px-6 md:py-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-300">AtHome</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Orçamentos</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
            Organize clientes, materiais e propostas com uma navegação mais prática e visual atualizado.
          </p>
        </div>

        <nav className="mt-8 grid gap-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active ? 'bg-white text-slate-950 shadow-lg shadow-sky-500/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <form action="/api/auth/logout" method="post" className="mt-8 md:mt-auto">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-100 hover:bg-rose-500/25">
            <span>↩</span>
            <span>Sair</span>
          </button>
        </form>
      </aside>

      <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
