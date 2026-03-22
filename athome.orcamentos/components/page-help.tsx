export function PageHelp({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-4 text-sm text-slate-700 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-base">💡</span>
        <div>
          <p className="font-semibold text-slate-900">Dica rápida</p>
          <p className="mt-1 leading-6">{text}</p>
        </div>
      </div>
    </div>
  );
}
