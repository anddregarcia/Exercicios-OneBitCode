import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const DEFAULT_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || 'budget';

export async function getScopedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Não autenticado');
  }

  const resolvedSchema = getBudgetSchemaName();

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
  if (message.toLowerCase().includes("could not find the table 'public.")) {
    message = 'As rotas estão apontando para o schema public, mas as tabelas do app não estão lá. Configure SUPABASE_DB_SCHEMA=budget no ambiente da aplicação.';
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
