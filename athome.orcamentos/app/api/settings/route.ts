import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

export async function GET() {
  try {
    const { supabase, user } = await getScopedClient();
    const { data } = await supabase.schema('budget').from('settings').select('*').eq('user_id', user.id).maybeSingle();
    return NextResponse.json(data || {});
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const payload = {
      user_id: user.id,
      company_name: cleanText(body.company_name) || null,
      cnpj: cleanText(body.cnpj) || null,
      address: cleanText(body.address) || null,
      phone: cleanText(body.phone) || null,
      email: cleanText(body.email) || null,
      instagram: cleanText(body.instagram) || null,
      pix_key: cleanText(body.pix_key) || null,
      bank_details: cleanText(body.bank_details) || null,
      logo_url: cleanText(body.logo_url) || null,
      default_labor_cost: cleanNumber(body.default_labor_cost)
    };

    const { data, error } = await supabase.schema('budget').from('settings').upsert(payload, { onConflict: 'user_id' }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
