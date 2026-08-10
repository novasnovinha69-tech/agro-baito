import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/carrinho";
import type { Pedido } from "@/types/database.types";

// =============================================================================
//  Auth do CLIENTE (cliente final da loja).
//  Diferente do admin: o cliente usa Supabase Auth mas NAO precisa estar na
//  tabela `admins`. Qualquer usuario autenticado (nao-admin) e um cliente.
// =============================================================================

export type ClienteSessao = {
  id: string;
  email: string;
};

/**
 * Le a sessao atual e devolve o cliente logado.
 * Retorna null se nao estiver logado OU se for admin (admins nao sao clientes).
 */
export async function getClienteAtual(): Promise<ClienteSessao | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  // Verifica se NAO e admin (admins usam /admin, clientes usam /conta)
  const sbAdmin = createSupabaseAdminClient();
  const { data: admin } = await sbAdmin
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (admin) return null; // e admin, nao cliente

  return { id: user.id, email: user.email ?? "" };
}

/**
 * Lista os pedidos de um cliente (pelo user_id do Supabase Auth).
 * Como pedidos nao tem user_id direto, buscamos por email/telefone.
 * Por simplicidade, busca pelos pedidos recentes (demo) ou por email.
 */
export async function listarPedidosDoCliente(
  email: string,
): Promise<Pedido[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("pedidos")
    .select("*")
    .ilike("cliente_email", email)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    console.warn("[listarPedidosDoCliente] erro:", error.message);
    return [];
  }
  return (data as Pedido[]) ?? [];
}
