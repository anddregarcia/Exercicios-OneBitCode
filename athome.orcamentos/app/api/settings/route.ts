import { NextResponse } from 'next/server';
import { getScopedClient } from '../_utils';

export async function GET() {
  const { supabase, user } = await getScopedClient();
  const { data } = await supabase.schema('budget').from('settings').select('*').eq('user_id', user.id).maybeSingle();
  return NextResponse.json(data || {});
}

export async function PUT(request: Request) {
  const { supabase, user } = await getScopedClient();
  const body = await request.json();
  const { data, error } = await supabase.schema('budget').from('settings').upsert({ ...body, user_id: user.id }, { onConflict: 'user_id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
