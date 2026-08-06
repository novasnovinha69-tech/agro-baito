import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Role = "master" | "admin" | "gerente" | null;

/**
 * Lê a sessão atual (no servidor) e devolve o usuário admin logado.
 * Retorna null se não estiver logado ou não for admin.
 */
export async function getAdminAtual(): Promise<{
  id: string;
  nome: string;
  email: string;
  role: Role;
} | null> {
  const sb = createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data } = await sb
    .from("admins")
    .select("id, nome, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  return data as { id: string; nome: string; email: string; role: Role };
}

/** Atalho: o usuário logado é MASTER (você)? */
export async function isMaster(): Promise<boolean> {
  const admin = await getAdminAtual();
  return admin?.role === "master";
}

/**
 * Verifica a permissão e retorna null se ok, ou um redirect para /admin/sem-permissao
 * Use em Server Components do painel: const denied = await requireRole('master');
 */
export async function requireRole(
  roleMinimo: "master" | "admin",
): Promise<{ allowed: boolean; admin: Awaited<ReturnType<typeof getAdminAtual>> }> {
  const admin = await getAdminAtual();
  if (!admin) return { allowed: false, admin: null };
  if (roleMinimo === "master" && admin.role !== "master") {
    return { allowed: false, admin };
  }
  return { allowed: true, admin };
}
