import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

function sortByStatus(a: any, b: any) {
  const weight: Record<string, number> = { approved: 0, pending: 1, canceled: 2 };
  return weight[a.status] - weight[b.status] || String(a.execution_date || '').localeCompare(String(b.execution_date || '')) || String(a.client_name || '').localeCompare(String(b.client_name || ''));
}

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const includeCanceled = new URL(request.url).searchParams.get('includeCanceled') === 'true';
    let query = supabase.schema('budget').from('estimates').select('id, estimate_number, status, execution_date, total_cost, clients(name)').eq('user_id', user.id);
    if (!includeCanceled) query = query.neq('status', 'canceled');
    const { data } = await query;
    const formatted = (data || []).map((item: any) => ({ ...item, client_name: item.clients?.name || 'Sem cliente' })).sort(sortByStatus);
    return NextResponse.json(formatted);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const clientName = cleanText(body.client_name);

    let client_id = null;
    if (clientName) {
      const { data: found } = await supabase.schema('budget').from('clients').select('*').eq('user_id', user.id).eq('name', clientName).maybeSingle();
      if (found) client_id = found.id;
      if (!found) {
        const { data: created, error: clientError } = await supabase.schema('budget').from('clients').insert({ user_id: user.id, name: clientName }).select('*').single();
        if (clientError) return NextResponse.json({ error: clientError.message }, { status: 400 });
        client_id = created?.id;
      }
    }

    const { data: last } = await supabase.schema('budget').from('estimates').select('estimate_number').eq('user_id', user.id).order('estimate_number', { ascending: false }).limit(1).maybeSingle();
    const estimate_number = (last?.estimate_number || 0) + 1;

    const estimatePayload = {
      user_id: user.id,
      client_id,
      estimate_number,
      problem_description: cleanText(body.problem_description) || null,
      problem_cause: cleanText(body.problem_cause) || null,
      labor_cost: cleanNumber(body.labor_cost),
      materials_cost: cleanNumber(body.materials_cost),
      total_cost: cleanNumber(body.total_cost),
      payment_method: cleanText(body.payment_method) || 'pix',
      installments: body.payment_method === 'credit' ? cleanNumber(body.installments) : null,
      execution_date: cleanText(body.execution_date) || null,
      execution_time_hours: cleanNumber(body.execution_time_hours),
      status: cleanText(body.status) || 'pending'
    };

    const { data: estimate, error } = await supabase.schema('budget').from('estimates').insert(estimatePayload).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    for (const item of body.materials || []) {
      const materialName = cleanText(item.name);
      if (!materialName) continue;

      let materialId = item.material_id || null;
      if (!materialId) {
        const { data: existingMaterial } = await supabase.schema('budget').from('materials').select('*').eq('user_id', user.id).eq('name', materialName).maybeSingle();
        if (existingMaterial) {
          materialId = existingMaterial.id;
          await supabase.schema('budget').from('materials').update({ default_price: cleanNumber(item.unit_price) }).eq('id', materialId).eq('user_id', user.id);
        } else {
          const { data: newMaterial, error: materialError } = await supabase.schema('budget').from('materials').insert({ user_id: user.id, name: materialName, default_price: cleanNumber(item.unit_price) }).select('*').single();
          if (materialError) return NextResponse.json({ error: materialError.message }, { status: 400 });
          materialId = newMaterial?.id;
        }
      }

      const { error: materialInsertError } = await supabase.schema('budget').from('estimate_materials').insert({
        estimate_id: estimate.id,
        material_id: materialId,
        name: materialName,
        quantity: cleanNumber(item.quantity),
        unit_price: cleanNumber(item.unit_price),
        total_price: cleanNumber(item.total_price)
      });

      if (materialInsertError) {
        return NextResponse.json({ error: materialInsertError.message }, { status: 400 });
      }
    }

    return NextResponse.json(estimate);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
