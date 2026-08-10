import "server-only";
import { MercadoPagoConfig, Payment } from "mercadopago";

/**
 * Wrapper do Mercado Pago (SDK Node oficial).
 *
 * Documentação Pix: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-pix
 *
 * Variáveis necessárias (.env):
 *   MP_ACCESS_TOKEN  — Access Token (produção ou TEST- para sandbox)
 *   NEXT_PUBLIC_SITE_URL — base para notification_url do webhook
 */

function mpClient(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MP_ACCESS_TOKEN ausente. Configure no .env.local (ver .env.example).",
    );
  }
  return new MercadoPagoConfig({ accessToken: token });
}

export type DadosPixInput = {
  /** Total EM CENTAVOS. ex: 16990 = R$ 169,90 */
  totalCents: number;
  /** Descrição curta. */
  descricao: string;
  /** Id externo para casar com o webhook. */
  referenciaExterna: string;
  /** Nome/CPF do pagador (opcional). */
  pagador?: { nome?: string; cpf?: string; email?: string };
};

export type DadosPixOutput = {
  pagamentoId: string;
  status: string; // pending | approved | rejected
  qrCode: string; // "copia e cola"
  qrCodeBase64: string | null; // imagem base64
  expiraEm: string | null; // ISO
};

/**
 * Cria um pagamento Pix dinâmico no Mercado Pago.
 * Retorna o QR Code (copia e cola) e a imagem para exibir.
 */
export async function criarPagamentoPix(
  input: DadosPixInput,
): Promise<DadosPixOutput> {
  const client = mpClient();
  const payment = new Payment(client);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const resposta = await payment.create({
    body: {
      transaction_amount: input.totalCents / 100,
      description: input.descricao,
      payment_method_id: "pix",
      external_reference: input.referenciaExterna,
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      payer: input.pagador
        ? {
            first_name: input.pagador.nome,
            email: input.pagador.email,
            identification: input.pagador.cpf
              ? { type: "CPF", number: input.pagador.cpf }
              : undefined,
          }
        : undefined,
      // Método Pix: o MP exige date_of_expiration (max 30 min por padrão).
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  });

  const tx = resposta.point_of_interaction?.transaction_data;
  return {
    pagamentoId: String(resposta.id),
    status: resposta.status ?? "pending",
    qrCode: tx?.qr_code ?? "",
    qrCodeBase64: tx?.qr_code_base64 ?? null,
    expiraEm: resposta.date_of_expiration ?? null,
  };
}

/**
 * Consulta um pagamento pelo ID (usado para confirmar no webhook ou via poll).
 */
export async function obterPagamento(pagamentoId: string) {
  const client = mpClient();
  const payment = new Payment(client);
  return payment.get({ id: Number(pagamentoId) });
}
