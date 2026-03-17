import { NextResponse } from 'next/server';
import { getScopedClient } from '@/app/api/utils';

export async function GET() {
  const { supabase, user } = await getScopedClient();
  const { data } = await supabase.schema('budget').from('clients').select('*').eq('user_id', user.id).order('name');
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { supabase, user } = await getScopedClient();
  const body = await request.json();
  const { data, error } = await supabase.schema('budget').from('clients').insert({ ...body, user_id: user.id }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { supabase, user } = await getScopedClient();
  const id = new URL(request.url).searchParams.get('id');
  await supabase.schema('budget').from('clients').delete().eq('id', id).eq('user_id', user.id);
  return NextResponse.json({ ok: true });
}
