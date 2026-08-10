import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { criarPagamentoPix } from "@/lib/mercadopago";
import { criarPedido } from "@/lib/pedidos";

/**
 * POST /api/checkout/criar-pedido
 *
 * Recebe o carrinho + dados do cliente + entrega + pagamento.
 * Cria o pedido no banco e, se pagamento for Pix, gera o QR Code.
 *
 * Body: ver tipo InputCriarPedido em lib/pedidos.ts.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itens, cliente, entrega, pagamento, valores } = body;

    // Validacao minima
    if (!itens?.length || !cliente?.nome || !cliente?.telefone) {
      return NextResponse.json(
        { erro: "Dados incompletos: itens, nome e telefone sao obrigatorios." },
        { status: 400 },
      );
    }
    if (!entrega?.tipo) {
      return NextResponse.json(
        { erro: "Tipo de entrega nao definido." },
        { status: 400 },
      );
    }

    // 1) Cria o pedido
    const pedido = await criarPedido({
      itens,
      cliente,
      entrega,
      pagamento: { metodo: pagamento?.metodo ?? "whatsapp" },
      valores,
    });

    // 2) Se for Pix e o Mercado Pago estiver configurado, gera o QR Code
    if (pagamento?.metodo === "pix" && process.env.MP_ACCESS_TOKEN) {
      try {
        const pix = await criarPagamentoPix({
          totalCents: valores.totalCents,
          descricao: `Pedido ${pedido.codigo}`,
          referenciaExterna: pedido.id,
          pagador: {
            nome: cliente.nome,
            cpf: cliente.cpfCnpj?.replace(/\D/g, "") || undefined,
            email: cliente.email || undefined,
          },
        });

        return NextResponse.json({
          pedido,
          pix: {
            qrCode: pix.qrCode,
            qrCodeBase64: pix.qrCodeBase64,
            pagamentoId: pix.pagamentoId,
            expiraEm: pix.expiraEm,
          },
        });
      } catch (err) {
        console.error(
          "[criar-pedido] erro ao gerar Pix:",
          err instanceof Error ? err.message : err,
        );
        // Mesmo com erro no Pix, o pedido foi criado — retorna para fallback WhatsApp
        return NextResponse.json({
          pedido,
          pix: null,
          aviso: "Pix indisponivel no momento. Use o WhatsApp para finalizar.",
        });
      }
    }

    // 3) Sem Pix (WhatsApp / retirada) — retorna so o pedido
    return NextResponse.json({
      pedido,
      pix:
        pagamento?.metodo === "pix" && !process.env.MP_ACCESS_TOKEN
          ? null
          : undefined,
      aviso:
        pagamento?.metodo === "pix" && !process.env.MP_ACCESS_TOKEN
          ? "Mercado Pago nao configurado. Use o WhatsApp para finalizar."
          : !isSupabaseConfigured()
            ? "Modo demonstracao — pedido nao sera persistido."
            : undefined,
    });
  } catch (err) {
    console.error("[criar-pedido] erro:", err);
    return NextResponse.json(
      { erro: "Erro interno ao criar pedido." },
      { status: 500 },
    );
  }
}
