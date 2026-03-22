import { NextResponse } from 'next/server';
import { apiErrorResponse, cleanNumber, cleanText, getScopedClient } from '@/app/api/utils';

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

    const { data: client } = await supabase.schema('budget').from('clients').select('*').eq('user_id', user.id).eq('name', clientName).maybeSingle();
    let clientId = client?.id;
    if (!clientId && clientName) {
      const { data, error: clientError } = await supabase.schema('budget').from('clients').insert({ user_id: user.id, name: clientName }).select('*').single();
      if (clientError) return NextResponse.json({ error: clientError.message }, { status: 400 });
      clientId = data?.id;
    }

    const { data: estimate, error } = await supabase.schema('budget').from('estimates').update({
      client_id: clientId,
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
    }).eq('id', id).eq('user_id', user.id).select('*').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.schema('budget').from('estimate_materials').delete().eq('estimate_id', id);
    for (const item of body.materials || []) {
      const materialName = cleanText(item.name);
      if (!materialName) continue;

      let materialId = item.material_id || null;
      const { data: existingMaterial } = await supabase.schema('budget').from('materials').select('*').eq('user_id', user.id).eq('name', materialName).maybeSingle();
      if (existingMaterial) {
        materialId = existingMaterial.id;
        await supabase.schema('budget').from('materials').update({ default_price: cleanNumber(item.unit_price) }).eq('id', materialId).eq('user_id', user.id);
      } else {
        const { data: newMaterial, error: materialError } = await supabase.schema('budget').from('materials').insert({ user_id: user.id, name: materialName, default_price: cleanNumber(item.unit_price) }).select('*').single();
        if (materialError) return NextResponse.json({ error: materialError.message }, { status: 400 });
        materialId = newMaterial?.id;
      }

      const { error: materialInsertError } = await supabase.schema('budget').from('estimate_materials').insert({
        estimate_id: id,
        material_id: materialId,
        name: materialName,
        quantity: cleanNumber(item.quantity),
        unit_price: cleanNumber(item.unit_price),
        total_price: cleanNumber(item.total_price)
      });

      if (materialInsertError) return NextResponse.json({ error: materialInsertError.message }, { status: 400 });
    }

    return NextResponse.json(estimate);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
