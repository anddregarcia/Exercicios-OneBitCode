import { NextResponse } from 'next/server';
import { getScopedClient } from '@/app/api/utils';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getScopedClient();
  const { id } = await params;

  const { data: source } = await supabase.schema('budget').from('estimates').select('*').eq('id', id).eq('user_id', user.id).single();
  const { data: materials } = await supabase.schema('budget').from('estimate_materials').select('*').eq('estimate_id', id);
  const { data: last } = await supabase.schema('budget').from('estimates').select('estimate_number').eq('user_id', user.id).order('estimate_number', { ascending: false }).limit(1).maybeSingle();

  const { data: duplicate } = await supabase.schema('budget').from('estimates').insert({ ...source, id: undefined, estimate_number: (last?.estimate_number || 0) + 1, status: 'pending' }).select('*').single();
  await supabase.schema('budget').from('estimate_materials').insert((materials || []).map((m: any) => ({ ...m, id: undefined, estimate_id: duplicate.id })));

  return NextResponse.json(duplicate);
}
