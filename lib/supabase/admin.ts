import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Client Supabase com SERVICE ROLE — ignora RLS.
 *
 * ⚠️  USE APENAS NO SERVIDOR (Route Handlers, Server Actions).
 * ⚠️  NUNCA exponha SUPABASE_SERVICE_ROLE_KEY no navegador.
 *
 * Casos de uso aqui: leitura de pedidos por token público (sem login),
 * criação de pedido por visitante, webhooks (Mercado Pago), relatórios.
 * Mesmo usando service role, mantemos validações explícitas no código.
 */
export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes. Este client é só para o servidor.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
