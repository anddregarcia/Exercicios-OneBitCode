import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase-server';

const DEFAULT_DB_SCHEMA = 'budget';

export async function getScopedClient() {
  const authClient = await createClient();
  const {
    data: { user },
    error
  } = await authClient.auth.getUser();

  if (error || !user) {
    throw new Error('Não autenticado');
  }

  const resolvedSchema = getBudgetSchemaName();
  const supabase = createAdminClient() || authClient;

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
    message = 'Schema budget inválido para a API. No painel do Supabase, adicione o schema budget em Settings > API > Exposed schemas ou configure SUPABASE_SERVICE_ROLE_KEY no ambiente.';
  }
  if (message.toLowerCase().includes("could not find the table 'public.")) {
    message = 'As tabelas do app precisam estar no schema budget. Execute o SQL em supabase/schema.sql no projeto Supabase.';
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

export function getBudgetSchemaName() {
  return DEFAULT_DB_SCHEMA;
}
