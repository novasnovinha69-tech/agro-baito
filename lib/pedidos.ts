import "server-only";

import { isSupabaseConfigured } from "@/lib/carrinho";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ItemCarrinho } from "@/lib/store/carrinho";
import type { Pedido } from "@/types/database.types";

// =============================================================================
//  Criação de pedidos (server-only).
//  Em modo demo (sem Supabase), gera um pedido mock com token de acesso.
// =============================================================================

export type EnderecoEntrega = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  referencia?: string;
};

export type InputCriarPedido = {
  itens: ItemCarrinho[];
  cliente: {
    nome: string;
    telefone: string;
    email?: string;
    cpfCnpj?: string;
    userId?: string | null;
  };
  entrega: {
    tipo: "retirada" | "entrega";
    zonaId?: string | null;
    unidadeId?: string | null;
    endereco?: EnderecoEntrega | null;
  };
  pagamento: {
    metodo: "pix" | "whatsapp" | "nao_loja";
  };
  valores: {
    subtotalCents: number;
    freteCents: number;
    totalCents: number;
  };
};

export type PedidoCriado = {
  id: string;
  codigo: string;
  token: string;
  status: string;
  totalCents: number;
};

/** Gera um código sequencial legível: AB-0001 */
async function proximoCodigo(): Promise<string> {
  const sb = createSupabaseAdminClient();
  const { count } = await sb
    .from("pedidos")
    .select("*", { count: "exact", head: true });
  const proximo = (count ?? 0) + 1;
  return `AB-${String(proximo).padStart(4, "0")}`;
}

/** Token aleatório de acesso (cliente acompanha pedido sem login). */
function gerarToken(): string {
  return (
    Math.random().toString(36).slice(2, 12) +
    Math.random().toString(36).slice(2, 12)
  );
}

/**
 * Cria um pedido completo no banco (pedidos + pedido_itens + status_historico).
 * Retorna o pedido com token de acesso.
 */
export async function criarPedido(
  input: InputCriarPedido,
): Promise<PedidoCriado> {
  const codigo = isSupabaseConfigured()
    ? await proximoCodigo()
    : `AB-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const token = gerarToken();

  // Modo demo: retorna pedido mock (nao persiste)
  if (!isSupabaseConfigured()) {
    return {
      id: `ped-demo-${Date.now()}`,
      codigo,
      token,
      status: "pendente",
      totalCents: input.valores.totalCents,
    };
  }

  const sb = createSupabaseAdminClient();

  // 1) Insere o pedido (insert sem select para evitar problemas de tipagem)
  const { error: errPedido } = await sb.from("pedidos").insert({
    codigo,
    cliente_nome: input.cliente.nome,
    cliente_telefone: input.cliente.telefone,
    cliente_email: input.cliente.email ?? null,
    cliente_cpf_cnpj: input.cliente.cpfCnpj ?? null,
    subtotal_cents: input.valores.subtotalCents,
    frete_cents: input.valores.freteCents,
    total_cents: input.valores.totalCents,
    zona_id: input.entrega.zonaId ?? null,
    unidade_id: input.entrega.unidadeId ?? null,
    tipo_entrega: input.entrega.tipo,
    endereco: input.entrega.endereco ?? null,
    status: "pendente",
    token_acesso: token,
  } as never);

  if (errPedido) {
    throw new Error(
      `Erro ao criar pedido: ${errPedido.message ?? "desconhecido"}`,
    );
  }

  // Busca o pedido recem-criado pelo token unico
  const { data: pedidoCriado } = await sb
    .from("pedidos")
    .select("*")
    .eq("token_acesso", token)
    .maybeSingle();
  const pedido = pedidoCriado as unknown as Pedido | null;
  if (!pedido) {
    throw new Error("Erro ao recuperar pedido recem-criado.");
  }

  // 2) Insere os itens
  const itensParaInserir = input.itens.map((i) => ({
    pedido_id: pedido.id,
    produto_id: i.produtoId,
    nome_snapshot: i.nome,
    preco_cents_snapshot: i.precoCents,
    quantidade: i.quantidade,
    peso_kg: i.pesoKg,
    unidade_medida: i.unidadeMedida,
  }));
  const { error: errItens } = await sb.from("pedido_itens").insert(
    itensParaInserir as never,
  );
  if (errItens) {
    console.error("[criarPedido] erro ao inserir itens:", errItens.message);
  }

  // 3) Registra no histórico
  await sb.from("status_historico").insert({
    pedido_id: pedido.id,
    status: "pendente",
    observacao: "Pedido criado via site",
  } as never);

  return {
    id: pedido.id,
    codigo: pedido.codigo,
    token: pedido.token_acesso,
    status: pedido.status,
    totalCents: pedido.total_cents,
  };
}

/**
 * Atualiza o status de um pedido e registra no histórico.
 */
export async function atualizarStatusPedido(
  pedidoId: string,
  novoStatus: string,
  dadosPagamento?: {
    pagamentoId?: string;
    pagamentoStatus?: string;
    pixQrCode?: string;
    pixQrBase64?: string;
    pixExpiraEm?: string;
  },
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = createSupabaseAdminClient();

  const update: Record<string, unknown> = {
    status: novoStatus,
    updated_at: new Date().toISOString(),
  };
  if (dadosPagamento?.pagamentoId) update.pagamento_id = dadosPagamento.pagamentoId;
  if (dadosPagamento?.pagamentoStatus) update.pagamento_status = dadosPagamento.pagamentoStatus;
  if (dadosPagamento?.pixQrCode !== undefined) update.pix_qr_code = dadosPagamento.pixQrCode;
  if (dadosPagamento?.pixQrBase64 !== undefined) update.pix_qr_base64 = dadosPagamento.pixQrBase64;
  if (dadosPagamento?.pixExpiraEm !== undefined) update.pix_expira_em = dadosPagamento.pixExpiraEm;

  await sb.from("pedidos").update(update as never).eq("id", pedidoId);
  await sb.from("status_historico").insert({
    pedido_id: pedidoId,
    status: novoStatus,
    observacao: dadosPagamento?.pagamentoStatus
      ? `Pagamento ${dadosPagamento.pagamentoStatus}`
      : null,
  } as never);
}

/**
 * Busca um pedido pelo token de acesso (cliente acompanha sem login).
 */
export async function obterPedidoPorToken(
  token: string,
): Promise<Pedido | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("pedidos")
    .select("*")
    .eq("token_acesso", token)
    .maybeSingle();
  if (error) return null;
  return (data as unknown as Pedido) ?? null;
}
