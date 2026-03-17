import { NextResponse } from 'next/server';
import { getScopedClient } from '../../_utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getScopedClient();
  const { id } = await params;
  const { data: estimate } = await supabase.schema('budget').from('estimates').select('*, clients(name)').eq('id', id).eq('user_id', user.id).single();
  const { data: materials } = await supabase.schema('budget').from('estimate_materials').select('*').eq('estimate_id', id);
  return NextResponse.json({ estimate, materials });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getScopedClient();
  const body = await request.json();
  const { id } = await params;

  const { data: client } = await supabase.schema('budget').from('clients').select('*').eq('user_id', user.id).eq('name', body.client_name).maybeSingle();
  let clientId = client?.id;
  if (!clientId && body.client_name) {
    const { data } = await supabase.schema('budget').from('clients').insert({ user_id: user.id, name: body.client_name }).select('*').single();
    clientId = data?.id;
  }

  const { data: estimate, error } = await supabase.schema('budget').from('estimates').update({
    client_id: clientId,
    problem_description: body.problem_description,
    problem_cause: body.problem_cause,
    labor_cost: body.labor_cost,
    materials_cost: body.materials_cost,
    total_cost: body.total_cost,
    payment_method: body.payment_method,
    installments: body.installments,
    execution_date: body.execution_date,
    execution_time_hours: body.execution_time_hours,
    status: body.status
  }).eq('id', id).eq('user_id', user.id).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.schema('budget').from('estimate_materials').delete().eq('estimate_id', id);
  for (const item of body.materials || []) {
    if (!item.name) continue;
    let materialId = item.material_id || null;
    const { data: existingMaterial } = await supabase.schema('budget').from('materials').select('*').eq('user_id', user.id).eq('name', item.name).maybeSingle();
    if (existingMaterial) {
      materialId = existingMaterial.id;
      await supabase.schema('budget').from('materials').update({ default_price: item.unit_price }).eq('id', materialId).eq('user_id', user.id);
    } else {
      const { data: newMaterial } = await supabase.schema('budget').from('materials').insert({ user_id: user.id, name: item.name, default_price: item.unit_price }).select('*').single();
      materialId = newMaterial?.id;
    }
    await supabase.schema('budget').from('estimate_materials').insert({ estimate_id: id, material_id: materialId, ...item });
  }

  return NextResponse.json(estimate);
}
