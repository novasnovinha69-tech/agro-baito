import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StatusPedido } from "@/types/database.types";

// Libera apenas status válidos
const STATUS_VALIDOS: StatusPedido[] = [
  "pendente",
  "aguardando_pagamento",
  "confirmado",
  "em_separacao",
  "saiu_para_entrega",
  "entregue",
  "cancelado",
];

/**
 * POST /api/admin/pedido-status
 * Body: { pedidoId: string, status: StatusPedido }
 *
 * Muda o status de um pedido. Usa service_role (ignora RLS) pois as escritas
 * em pedidos/status_historico não são permitidas pela anon key.
 *
 * Segurança: exige usuário logado + admin (validado pela session).
 */
export async function POST(req: NextRequest) {
  try {
    const { pedidoId, status } = (await req.json()) as {
      pedidoId?: string;
      status?: string;
    };

    if (!pedidoId || !status) {
      return NextResponse.json(
        { erro: "pedidoId e status são obrigatórios." },
        { status: 400 },
      );
    }
    if (!STATUS_VALIDOS.includes(status as StatusPedido)) {
      return NextResponse.json(
        { erro: "Status inválido." },
        { status: 400 },
      );
    }

    // 1) Valida sessão + role admin (camada de segurança)
    const sbSession = createSupabaseServerClient();
    const {
      data: { user },
    } = await sbSession.auth.getUser();
    if (!user) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }
    const { data: admin } = await sbSession
      .from("admins")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!admin) {
      return NextResponse.json(
        { erro: "Sem permissão de administrador." },
        { status: 403 },
      );
    }

    // 2) Atualiza com service_role (ignora RLS)
    const sb = createSupabaseAdminClient();
    const { error: err1 } = await sb
      .from("pedidos")
      .update({ status } as never)
      .eq("id", pedidoId);
    if (err1) throw err1;

    // 3) Registra no histórico
    const { error: err2 } = await sb.from("status_historico").insert({
      pedido_id: pedidoId,
      status: status as StatusPedido,
    } as never);
    if (err2) throw err2;

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("[api/admin/pedido-status] erro:", err);
    return NextResponse.json(
      { erro: err instanceof Error ? err.message : "Erro interno." },
      { status: 500 },
    );
  }
}
