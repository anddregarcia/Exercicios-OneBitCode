import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { apiErrorResponse, getScopedClient } from '@/app/api/utils';

export const runtime = 'nodejs';

function renderEstimateHtml(estimate: any, materials: any[], settings: any) {
  const currency = (value: number) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
  const payment = `${estimate.payment_method}${estimate.installments ? ` em ${estimate.installments}x` : ''}`;
  const execution = `${estimate.execution_date || '-'} (${estimate.execution_time_hours || 0}h)`;

  return `
  <html>
    <body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a">
      <main style="max-width:860px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:22px;padding:28px;box-shadow:0 12px 32px rgba(15,23,42,.08)">
        <header style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding-bottom:20px;border-bottom:1px solid #e2e8f0">
          <div>
            <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#64748b">Relatório de orçamento</p>
            <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2">${settings?.company_name || 'Prestador de Serviço'}</h1>
            <p style="margin:10px 0 0;font-size:13px;color:#475569">${settings?.cnpj || ''} ${settings?.phone ? `• ${settings.phone}` : ''}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#475569">${settings?.address || ''}</p>
          </div>
          <div style="text-align:right">
            <p style="margin:0;font-size:13px;color:#64748b">Orçamento</p>
            <p style="margin:6px 0 0;font-size:26px;font-weight:700">#${estimate.estimate_number}</p>
          </div>
        </header>

        <section style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin-top:20px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px">
          <p style="margin:0"><strong>Cliente:</strong> ${estimate.clients?.name || '-'}</p>
          <p style="margin:0"><strong>Pagamento:</strong> ${payment}</p>
          <p style="margin:0"><strong>Execução:</strong> ${execution}</p>
          <p style="margin:0"><strong>Status:</strong> ${estimate.status || 'pending'}</p>
        </section>

        <section style="margin-top:20px">
          <h2 style="margin:0 0 8px;font-size:18px">Diagnóstico</h2>
          <p style="margin:0 0 10px;color:#334155"><strong>Problema:</strong> ${estimate.problem_description || '-'}</p>
          <p style="margin:0;color:#334155"><strong>Causa:</strong> ${estimate.problem_cause || '-'}</p>
        </section>

        <section style="margin-top:20px">
          <h2 style="margin:0 0 10px;font-size:18px">Materiais</h2>
          <table style="width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
            <thead>
              <tr style="background:#f8fafc;color:#475569">
                <th style="padding:10px;text-align:left;font-size:12px">Item</th>
                <th style="padding:10px;text-align:right;font-size:12px">Qtd.</th>
                <th style="padding:10px;text-align:right;font-size:12px">Unitário</th>
                <th style="padding:10px;text-align:right;font-size:12px">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${
                (materials || []).length
                  ? (materials || [])
                      .map(
                        (m: any) => `
                <tr>
                  <td style="padding:10px;border-top:1px solid #e2e8f0">${m.name}</td>
                  <td style="padding:10px;border-top:1px solid #e2e8f0;text-align:right">${m.quantity}</td>
                  <td style="padding:10px;border-top:1px solid #e2e8f0;text-align:right">${currency(m.unit_price)}</td>
                  <td style="padding:10px;border-top:1px solid #e2e8f0;text-align:right">${currency(m.total_price)}</td>
                </tr>`
                      )
                      .join('')
                  : `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b">Nenhum material informado.</td></tr>`
              }
            </tbody>
          </table>
        </section>

        <section style="display:grid;justify-content:end;margin-top:20px">
          <div style="min-width:260px;border:1px solid #e2e8f0;border-radius:14px;padding:14px">
            <p style="display:flex;justify-content:space-between;margin:0 0 8px"><span style="color:#64748b">Mão de obra</span><strong>${currency(estimate.labor_cost)}</strong></p>
            <p style="display:flex;justify-content:space-between;margin:0 0 8px"><span style="color:#64748b">Materiais</span><strong>${currency(estimate.materials_cost)}</strong></p>
            <p style="display:flex;justify-content:space-between;margin:0;padding-top:10px;border-top:1px solid #e2e8f0;font-size:18px"><span>Total</span><strong>${currency(estimate.total_cost)}</strong></p>
          </div>
        </section>

        <footer style="margin-top:22px;padding-top:14px;border-top:1px solid #e2e8f0;color:#475569;font-size:13px">
          <p style="margin:0 0 4px"><strong>PIX:</strong> ${settings?.pix_key || '-'}</p>
          <p style="margin:0"><strong>Banco:</strong> ${settings?.bank_details || '-'}</p>
        </footer>
      </main>
    </body>
  </html>`;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await getScopedClient();
    const { id } = await params;
    const [{ data: estimate, error: estimateError }, { data: materials }, { data: settings }] = await Promise.all([
      supabase.schema('budget').from('estimates').select('*, clients(name)').eq('id', id).eq('user_id', user.id).single(),
      supabase.schema('budget').from('estimate_materials').select('*').eq('estimate_id', id),
      supabase.schema('budget').from('settings').select('*').eq('user_id', user.id).maybeSingle()
    ]);

    if (estimateError || !estimate) {
      return NextResponse.json({ error: 'Orçamento não encontrado para gerar PDF.' }, { status: 404 });
    }

    const html = renderEstimateHtml(estimate, materials || [], settings);

    try {
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
    } catch {
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }
  } catch (error) {
    return apiErrorResponse(error);
  }
}
