import type { Database } from "@/types/database.types";

// Tipos práticos derivados do schema ---------------------------------------
export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type Produto = Database["public"]["Tables"]["produtos"]["Row"];
export type Unidade = Database["public"]["Tables"]["unidades"]["Row"];
export type ZonaEntrega = Database["public"]["Tables"]["zonas_entrega"]["Row"];
export type StatusPedido =
  Database["public"]["Tables"]["pedidos"]["Row"]["status"];

// Produto enriquecido (com categoria) — forma como o frontend consome -------
export type ProdutoComCategoria = Produto & {
  categorias?: Pick<Categoria, "id" | "nome" | "slug"> | null;
};

// Verifica se o Supabase está configurado (caso contrário usamos mocks) -----
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Helpers de preço ----------------------------------------------------------
export function precoEfetivoCents(p: Produto): number {
  return p.preco_promocional_cents ?? p.preco_cents;
}

export function temPromocao(p: Produto): boolean {
  return (
    p.preco_promocional_cents != null &&
    p.preco_promocional_cents < p.preco_cents
  );
}

export function precoPorUnidadeCents(p: Produto): number | null {
  if (!p.preco_por_kg || !p.peso_kg) return null;
  return Math.round(precoEfetivoCents(p) / p.peso_kg);
}
