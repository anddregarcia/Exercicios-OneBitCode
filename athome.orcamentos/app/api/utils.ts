import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const DEFAULT_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'budget';
let resolvedSchemaCache: string | null = null;

export async function getScopedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Não autenticado');
  }

  const resolvedSchema = await getBudgetSchemaName(supabase);

  return {
    supabase: new Proxy(supabase, {
      get(target, prop, receiver) {
        if (prop === 'schema') {
          return (requestedSchema: string) => {
            const schemaName = requestedSchema === DEFAULT_DB_SCHEMA || requestedSchema === 'budget' ? resolvedSchema : requestedSchema;
            return target.schema(schemaName);
          };
        }

        const value = Reflect.get(target, prop, receiver);
        return typeof value === 'function' ? value.bind(target) : value;
      }
    }),
    user
  };
}

export function apiErrorResponse(error: unknown) {
  let message = error instanceof Error ? error.message : 'Erro interno do servidor';
  if (message.toLowerCase().includes('invalid schema')) {
    message = 'Schema do banco não encontrado. Confira a variável SUPABASE_DB_SCHEMA ou execute o SQL em supabase/schema.sql.';
  }
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

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return '';
}

function isInvalidSchemaError(error: unknown) {
  return getErrorMessage(error).toLowerCase().includes('invalid schema');
}

function isMissingRelationError(error: unknown) {
  return getErrorMessage(error).toLowerCase().includes('does not exist');
}

export async function getBudgetSchemaName(supabase: any) {
  if (resolvedSchemaCache) {
    return resolvedSchemaCache;
  }

  const candidates = [...new Set([DEFAULT_DB_SCHEMA, 'public'])];

  for (const candidate of candidates) {
    const { error } = await supabase.schema(candidate).from('clients').select('id').limit(1);

    if (!error) {
      resolvedSchemaCache = candidate;
      return candidate;
    }

    if (isInvalidSchemaError(error)) {
      continue;
    }

    if (candidate === 'public' && isMissingRelationError(error)) {
      throw new Error('Banco não configurado. Rode o SQL de supabase/schema.sql no projeto Supabase.');
    }

    resolvedSchemaCache = candidate;
    return candidate;
  }

  throw new Error(`Schema inválido. Configure SUPABASE_DB_SCHEMA ou rode o SQL do projeto para criar o schema "${DEFAULT_DB_SCHEMA}".`);
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
