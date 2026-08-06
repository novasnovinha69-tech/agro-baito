"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Client Supabase para uso no BROWSER (componentes cliente).
 * Usa a chave ANON (pública) + RLS para segurança.
 * Nunca use a service_role aqui.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes. " +
        "Veja o .env.example.",
    );
  }

  return createBrowserClient<Database>(url, anon);
}
