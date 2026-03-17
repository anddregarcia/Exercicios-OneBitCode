import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getScopedClient } from '@/app/api/utils';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getScopedClient();
  const { id } = await params;
  const [{ data: estimate }, { data: materials }, { data: settings }] = await Promise.all([
    supabase.schema('budget').from('estimates').select('*, clients(name)').eq('id', id).eq('user_id', user.id).single(),
    supabase.schema('budget').from('estimate_materials').select('*').eq('estimate_id', id),
    supabase.schema('budget').from('settings').select('*').eq('user_id', user.id).maybeSingle()
  ]);

  const html = `
  <html><body style="font-family:Arial;padding:24px">
    <h1>${settings?.company_name || 'Prestador de Serviço'}</h1>
    <p>${settings?.cnpj || ''} | ${settings?.phone || ''} | ${settings?.address || ''}</p>
    <hr/>
    <h2>Orçamento #${estimate.estimate_number}</h2>
    <p><strong>Cliente:</strong> ${estimate.clients?.name || '-'}</p>
    <p><strong>Problema:</strong> ${estimate.problem_description || '-'}</p>
    <p><strong>Causa:</strong> ${estimate.problem_cause || '-'}</p>
    <h3>Materiais</h3>
    <ul>${(materials || []).map((m: any) => `<li>${m.name}: ${m.quantity} x R$ ${Number(m.unit_price).toFixed(2)} = R$ ${Number(m.total_price).toFixed(2)}</li>`).join('')}</ul>
    <p><strong>Mão de obra:</strong> R$ ${Number(estimate.labor_cost).toFixed(2)}</p>
    <p><strong>Total:</strong> R$ ${Number(estimate.total_cost).toFixed(2)}</p>
    <p><strong>Pagamento:</strong> ${estimate.payment_method}${estimate.installments ? ` em ${estimate.installments}x` : ''}</p>
    <p><strong>Previsão:</strong> ${estimate.execution_date || '-'} (${estimate.execution_time_hours || 0}h)</p>
    <hr/><p>PIX: ${settings?.pix_key || '-'} | Banco: ${settings?.bank_details || '-'}</p>
  </body></html>`;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="orcamento-${estimate.estimate_number}.pdf"`
    }
  });
}
