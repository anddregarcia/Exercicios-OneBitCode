import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

async function resolveClientId(supabase: any, userId: string, clientName: string) {
  if (!clientName) return null;

  const { data: existingClients } = await supabase
    .schema('budget')
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .eq('name', clientName)
    .limit(1);

  if (existingClients?.[0]?.id) {
    return existingClients[0].id;
  }

  const { data: created, error } = await supabase
    .schema('budget')
    .from('clients')
    .insert({ user_id: userId, name: clientName })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao salvar cliente do orçamento: ${error.message}`);
  return created.id;
}

async function resolveMaterialId(supabase: any, userId: string, item: any) {
  if (!item.name) return null;

  if (item.material_id) {
    return item.material_id;
  }

  const { data: existingMaterials } = await supabase
    .schema('budget')
    .from('materials')
    .select('id')
    .eq('user_id', userId)
    .eq('name', item.name)
    .limit(1);

  if (existingMaterials?.[0]?.id) {
    await supabase
      .schema('budget')
      .from('materials')
      .update({ default_price: cleanNumber(item.unit_price) })
      .eq('id', existingMaterials[0].id)
      .eq('user_id', userId);

    return existingMaterials[0].id;
  }

  const { data: created, error } = await supabase
    .schema('budget')
    .from('materials')
    .insert({
      user_id: userId,
      name: item.name,
      default_price: cleanNumber(item.unit_price)
    })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao salvar material do orçamento: ${error.message}`);
  return created.id;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await getScopedClient();
    const { id } = await params;
    const { data: estimate } = await supabase.schema('budget').from('estimates').select('*, clients(name)').eq('id', id).eq('user_id', user.id).single();
    const { data: materials } = await supabase.schema('budget').from('estimate_materials').select('*').eq('estimate_id', id);
    return NextResponse.json({ estimate, materials });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await getScopedClient();
    const body = await request.json();
    const { id } = await params;
    const clientName = cleanText(body.client_name);
    const clientId = await resolveClientId(supabase, user.id, clientName);
    const normalizedMaterials = (body.materials || [])
      .map((item: any) => ({
        material_id: item.material_id || null,
        name: cleanText(item.name),
        quantity: cleanNumber(item.quantity) || 1,
        unit_price: cleanNumber(item.unit_price),
        total_price: cleanNumber(item.total_price || cleanNumber(item.quantity) * cleanNumber(item.unit_price))
      }))
      .filter((item: any) => item.name);

    const { data: estimate, error } = await supabase.schema('budget').from('estimates').update({
      client_id: clientId,
      problem_description: cleanText(body.problem_description) || null,
      problem_cause: cleanText(body.problem_cause) || null,
      labor_cost: cleanNumber(body.labor_cost),
      materials_cost: cleanNumber(body.materials_cost),
      total_cost: cleanNumber(body.total_cost),
      payment_method: cleanText(body.payment_method) || 'pix',
      installments: body.payment_method === 'credit' ? Math.max(1, cleanNumber(body.installments) || 1) : null,
      execution_date: cleanText(body.execution_date) || null,
      execution_time_hours: cleanNumber(body.execution_time_hours) || 1,
      status: cleanText(body.status) || 'pending'
    }).eq('id', id).eq('user_id', user.id).select('*').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.schema('budget').from('estimate_materials').delete().eq('estimate_id', id);
    for (const item of normalizedMaterials) {
      const materialId = await resolveMaterialId(supabase, user.id, item);

      const { error: materialInsertError } = await supabase.schema('budget').from('estimate_materials').insert({
        estimate_id: id,
        material_id: materialId,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      });

      if (materialInsertError) return NextResponse.json({ error: materialInsertError.message }, { status: 400 });
    }

    return NextResponse.json(estimate);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
