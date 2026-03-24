import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

export async function GET() {
  try {
    const { supabase, user } = await getScopedClient();
    const { data } = await supabase.schema('budget').from('materials').select('*').eq('user_id', user.id).order('name');
    return NextResponse.json(data || []);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const name = cleanText(body.name);

    if (!name) {
      return NextResponse.json({ error: 'O nome do material é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabase.schema('budget').from('materials').insert({
      name,
      default_price: cleanNumber(body.default_price),
      user_id: user.id
    }).select('*').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const id = cleanText(body.id);
    const name = cleanText(body.name);

    if (!id) {
      return NextResponse.json({ error: 'Informe o material para editar.' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'O nome do material é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .schema('budget')
      .from('materials')
      .update({
        name,
        default_price: cleanNumber(body.default_price)
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const id = new URL(request.url).searchParams.get('id');
    await supabase.schema('budget').from('materials').delete().eq('id', id).eq('user_id', user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
