import { createClient } from '@/lib/supabase-server';

export async function getScopedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Não autenticado');
  return { supabase, user };
}
