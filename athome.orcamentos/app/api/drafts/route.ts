import { NextResponse } from 'next/server';
import { apiErrorResponse, getScopedClient } from '@/app/api/utils';

export async function GET() {
  try {
    const { supabase, user } = await getScopedClient();
    const { data } = await supabase.schema('budget').from('drafts').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1).maybeSingle();
    return NextResponse.json({ draft: data || null });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const { data, error } = await supabase.schema('budget').from('drafts').upsert({ user_id: user.id, data: body.data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
