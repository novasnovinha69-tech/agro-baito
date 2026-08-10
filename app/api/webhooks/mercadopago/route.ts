import { NextResponse } from "next/server";
import { obterPagamento } from "@/lib/mercadopago";
import { atualizarStatusPedido } from "@/lib/pedidos";

/**
 * Webhook do Mercado Pago — POST /api/webhooks/mercadopago
 *
 * O MP envia notificacoes de mudanca de status de pagamento.
 * Configurar no painel do MP a URL: https://SEU-DOMINIO/api/webhooks/mercadopago
 *
 * Body (tipo payment):
 *   { type: "payment", data: { id: "123456789" } }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // O MP pode enviar diferentes tipos de notificacao
    if (body.type !== "payment" || !body.data?.id) {
      // Nao e uma notificacao de pagamento — responde 200 para o MP nao reintentar
      return NextResponse.json({ ok: true });
    }

    const pagamentoId = String(body.data.id);

    // Busca os detalhes do pagamento no MP
    const pagamento = await obterPagamento(pagamentoId);
    const externalRef = String(pagamento.external_reference ?? "");
    const status = String(pagamento.status ?? "pending");

    if (!externalRef) {
      console.warn("[webhook-mp] pagamento sem external_reference:", pagamentoId);
      return NextResponse.json({ ok: true });
    }

    // Mapeia status do MP para status do pedido
    // approved -> confirmado; rejected/cancelled -> cancelado; outros -> aguardando_pagamento
    let novoStatus = "aguardando_pagamento";
    if (status === "approved") novoStatus = "confirmado";
    else if (status === "rejected" || status === "cancelled") novoStatus = "cancelado";

    await atualizarStatusPedido(externalRef, novoStatus, {
      pagamentoId,
      pagamentoStatus: status,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "[webhook-mp] erro:",
      err instanceof Error ? err.message : err,
    );
    // Retorna 200 mesmo com erro para o MP nao reintentar infinitamente
    return NextResponse.json({ ok: true });
  }
}

/** GET — verificacao do webhook (alguns servicos fazem GET primeiro). */
export async function GET() {
  return NextResponse.json({ status: "webhook ativo" });
}
