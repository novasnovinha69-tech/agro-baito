import "server-only";

import { isSupabaseConfigured } from "@/lib/carrinho";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockProdutos, mockCategorias, mockUnidades } from "@/lib/mock-data";
import type {
  Produto,
  Categoria,
  Pedido,
} from "@/types/database.types";

// =============================================================================
//  Acesso a dados do ADMIN.
//  Em modo demo (sem Supabase) opera sobre os mocks.
//  Em modo real, usa service_role (ignora RLS) — sempre no servidor.
// =============================================================================

export async function adminListarProdutos(): Promise<
  (Produto & { categoria?: { nome: string } | null })[]
> {
  if (!isSupabaseConfigured()) {
    return mockProdutos.map((p) => ({
      ...p,
      categoria: mockCategorias.find((c) => c.id === p.categoria_id) ?? null,
    }));
  }
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("produtos")
    .select("*, categorias(nome)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as (Produto & { categoria?: { nome: string } | null })[]) ?? [];
}

export async function adminListarCategorias(): Promise<Categoria[]> {
  if (!isSupabaseConfigured()) return mockCategorias;
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true });
  if (error) throw error;
  return (data as Categoria[]) ?? [];
}

export async function adminListarPedidos(): Promise<Pedido[]> {
  if (!isSupabaseConfigured()) {
    // Pedidos mock para o dashboard demo
    return [
      {
        id: "ped-demo-1",
        codigo: "AMA-0001",
        cliente_nome: "João da Silva",
        cliente_telefone: "47999887766",
        cliente_email: null,
        cliente_cpf_cnpj: null,
        subtotal_cents: 16990,
        frete_cents: 1700,
        total_cents: 18690,
        zona_id: null,
        unidade_id: null,
        tipo_entrega: "entrega",
        endereco: { bairro: "Tabuleiro", cidade: "Itapema" },
        status: "confirmado",
        pagamento_id: null,
        pagamento_status: "approved",
        pix_qr_code: null,
        pix_qr_base64: null,
        pix_expira_em: null,
        observacoes: null,
        token_acesso: "demo",
        created_at: new Date(Date.now() - 3600_000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "ped-demo-2",
        codigo: "AMA-0002",
        cliente_nome: "Maria Produção Rural",
        cliente_telefone: "47988776655",
        cliente_email: null,
        cliente_cpf_cnpj: null,
        subtotal_cents: 7490,
        frete_cents: 750,
        total_cents: 8240,
        zona_id: null,
        unidade_id: null,
        tipo_entrega: "retirada",
        endereco: null,
        status: "pendente",
        pagamento_id: null,
        pagamento_status: "pending",
        pix_qr_code: null,
        pix_qr_base64: null,
        pix_expira_em: null,
        observacoes: null,
        token_acesso: "demo",
        created_at: new Date(Date.now() - 7200_000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data as Pedido[]) ?? [];
}

export type EstoqueBaixoItem = {
  id: string;
  nome: string;
  estoque: number;
  estoque_minimo: number;
  categoria?: string;
};

export async function adminEstoqueBaixo(): Promise<EstoqueBaixoItem[]> {
  const produtos = await adminListarProdutos();
  return produtos
    .filter((p) => p.estoque <= p.estoque_minimo)
    .map((p) => ({
      id: p.id,
      nome: p.nome,
      estoque: p.estoque,
      estoque_minimo: p.estoque_minimo,
      categoria: p.categoria?.nome,
    }));
}

/** Busca 1 pedido pelo ID (sem limit de 50). */
export async function adminObterPedidoPorId(
  id: string,
): Promise<Pedido | null> {
  if (!isSupabaseConfigured()) {
    const pedidos = await adminListarPedidos();
    return pedidos.find((p) => p.id === id) ?? null;
  }
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("pedidos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Pedido | null) ?? null;
}

/** Busca 1 produto pelo ID (sem baixar todo o catálogo). */
export async function adminObterProdutoPorId(
  id: string,
): Promise<(Produto & { categoria?: { nome: string } | null }) | null> {
  if (!isSupabaseConfigured()) {
    const produtos = await adminListarProdutos();
    return produtos.find((p) => p.id === id) ?? null;
  }
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("produtos")
    .select("*, categorias(nome)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (
    (data as unknown as (Produto & {
      categoria?: { nome: string } | null;
    })) ?? null
  );
}
