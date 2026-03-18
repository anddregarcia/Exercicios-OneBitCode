import { NextResponse } from 'next/server';
import { getScopedClient } from '@/app/api/utils';

export async function GET() {
  const { supabase, user } = await getScopedClient();
  const { data } = await supabase.schema('budget').from('drafts').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1).maybeSingle();
  return NextResponse.json({ draft: data || null });
}

export async function POST(request: Request) {
  const { supabase, user } = await getScopedClient();
  const body = await request.json();
  const { data, error } = await supabase.schema('budget').from('drafts').upsert({ user_id: user.id, data: body.data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
