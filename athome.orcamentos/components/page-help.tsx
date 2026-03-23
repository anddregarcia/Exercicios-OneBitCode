'use client';

import { useState } from 'react';

export function PageHelp({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="secondary-button w-fit px-4 py-2 text-sm"
      >
        ℹ️ Dica rápida
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg">💡</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-950">Dica rápida</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} className="primary-button">
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
