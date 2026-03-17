import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Orçamentos' },
  { href: '/clients', label: 'Clientes' },
  { href: '/materials', label: 'Materiais' },
  { href: '/settings', label: 'Configurações' }
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-slate-900 p-3 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <strong className="mr-4">AtHome Orçamentos</strong>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded bg-slate-700 px-3 py-1 text-sm">
              {link.label}
            </Link>
          ))}
          <form action="/api/auth/logout" method="post" className="ml-auto">
            <button className="bg-red-500 text-white">Sair</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
