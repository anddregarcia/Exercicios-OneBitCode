import { NextResponse } from 'next/server';
import { getScopedClient } from '../_utils';

function sortByStatus(a: any, b: any) {
  const weight: Record<string, number> = { approved: 0, pending: 1, canceled: 2 };
  return weight[a.status] - weight[b.status] || String(a.execution_date || '').localeCompare(String(b.execution_date || '')) || String(a.client_name || '').localeCompare(String(b.client_name || ''));
}

export async function GET(request: Request) {
  const { supabase, user } = await getScopedClient();
  const includeCanceled = new URL(request.url).searchParams.get('includeCanceled') === 'true';
  let query = supabase.schema('budget').from('estimates').select('id, estimate_number, status, execution_date, total_cost, clients(name)').eq('user_id', user.id);
  if (!includeCanceled) query = query.neq('status', 'canceled');
  const { data } = await query;
  const formatted = (data || []).map((item: any) => ({ ...item, client_name: item.clients?.name || 'Sem cliente' })).sort(sortByStatus);
  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const { supabase, user } = await getScopedClient();
  const body = await request.json();
  const clientName = body.client_name?.trim();

  let client_id = null;
  if (clientName) {
    const { data: found } = await supabase.schema('budget').from('clients').select('*').eq('user_id', user.id).eq('name', clientName).maybeSingle();
    if (found) client_id = found.id;
    if (!found) {
      const { data: created } = await supabase.schema('budget').from('clients').insert({ user_id: user.id, name: clientName }).select('*').single();
      client_id = created?.id;
    }
  }

  const { data: last } = await supabase.schema('budget').from('estimates').select('estimate_number').eq('user_id', user.id).order('estimate_number', { ascending: false }).limit(1).maybeSingle();
  const estimate_number = (last?.estimate_number || 0) + 1;

  const estimatePayload = {
    user_id: user.id,
    client_id,
    estimate_number,
    problem_description: body.problem_description,
    problem_cause: body.problem_cause,
    labor_cost: body.labor_cost,
    materials_cost: body.materials_cost,
    total_cost: body.total_cost,
    payment_method: body.payment_method,
    installments: body.installments,
    execution_date: body.execution_date,
    execution_time_hours: body.execution_time_hours,
    status: body.status || 'pending'
  };

  const { data: estimate, error } = await supabase.schema('budget').from('estimates').insert(estimatePayload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  for (const item of body.materials || []) {
    if (!item.name) continue;
    let materialId = item.material_id || null;
    if (!materialId) {
      const { data: existingMaterial } = await supabase.schema('budget').from('materials').select('*').eq('user_id', user.id).eq('name', item.name).maybeSingle();
      if (existingMaterial) {
        materialId = existingMaterial.id;
        await supabase.schema('budget').from('materials').update({ default_price: item.unit_price }).eq('id', materialId).eq('user_id', user.id);
      } else {
        const { data: newMaterial } = await supabase.schema('budget').from('materials').insert({ user_id: user.id, name: item.name, default_price: item.unit_price }).select('*').single();
        materialId = newMaterial?.id;
      }
    }

    await supabase.schema('budget').from('estimate_materials').insert({
      estimate_id: estimate.id,
      material_id: materialId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    });
  }

  return NextResponse.json(estimate);
}
