import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

function sortByStatus(a: any, b: any) {
  const weight: Record<string, number> = { approved: 0, pending: 1, canceled: 2 };
  return weight[a.status] - weight[b.status] || String(a.execution_date || '').localeCompare(String(b.execution_date || '')) || String(a.client_name || '').localeCompare(String(b.client_name || ''));
}

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
  const materialName = cleanText(item.name);
  if (!materialName) return null;

  if (item.material_id) {
    return item.material_id;
  }

  const { data: existingMaterials } = await supabase
    .schema('budget')
    .from('materials')
    .select('id')
    .eq('user_id', userId)
    .eq('name', materialName)
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

  const { data: newMaterial, error } = await supabase
    .schema('budget')
    .from('materials')
    .insert({
      user_id: userId,
      name: materialName,
      default_price: cleanNumber(item.unit_price)
    })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao salvar material do orçamento: ${error.message}`);
  return newMaterial.id;
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
    const normalizedMaterials = (body.materials || [])
      .map((item: any) => ({
        material_id: item.material_id || null,
        name: cleanText(item.name),
        quantity: cleanNumber(item.quantity) || 1,
        unit_price: cleanNumber(item.unit_price),
        total_price: cleanNumber(item.total_price || cleanNumber(item.quantity) * cleanNumber(item.unit_price))
      }))
      .filter((item: any) => item.name);

    const client_id = await resolveClientId(supabase, user.id, clientName);

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
      installments: body.payment_method === 'credit' ? Math.max(1, cleanNumber(body.installments) || 1) : null,
      execution_date: cleanText(body.execution_date) || null,
      execution_time_hours: cleanNumber(body.execution_time_hours) || 1,
      status: cleanText(body.status) || 'pending'
    };

    const { data: estimate, error } = await supabase.schema('budget').from('estimates').insert(estimatePayload).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    for (const item of normalizedMaterials) {
      const materialId = await resolveMaterialId(supabase, user.id, item);

      const { error: materialInsertError } = await supabase.schema('budget').from('estimate_materials').insert({
        estimate_id: estimate.id,
        material_id: materialId,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
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
