import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function getScopedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Não autenticado');
  }

  return { supabase, user };
}

export function apiErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  const status = message === 'Não autenticado' ? 401 : 500;
  return NextResponse.json({ error: message }, { status });
}

export function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function cleanNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
