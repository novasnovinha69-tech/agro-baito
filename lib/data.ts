import "server-only";

import { isSupabaseConfigured } from "@/lib/carrinho";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  mockCategorias,
  mockProdutos,
  mockUnidades,
} from "@/lib/mock-data";
import type {
  Categoria,
  Produto,
  ProdutoComCategoria,
} from "@/lib/carrinho";
import type { Unidade, ZonaEntrega } from "@/types/database.types";

// =============================================================================
//  Camada de acesso a dados (somente servidor).
//  Quando o Supabase está configurado → busca no banco.
//  Caso contrário → devolve os mocks (site visualiza sem backend).
// =============================================================================

export async function listarCategorias(): Promise<Categoria[]> {
  if (!isSupabaseConfigured()) return mockCategorias;
  const sb = createSupabaseServerClient();
  const { data, error } = await sb
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true });
  if (error) {
    console.warn("[listarCategorias] erro — usando mocks:", error.message);
    return mockCategorias;
  }
  return (data as Categoria[]) ?? mockCategorias;
}

export async function listarProdutos(opts?: {
  categoriaSlug?: string;
  destaque?: boolean;
  busca?: string;
}): Promise<ProdutoComCategoria[]> {
  if (!isSupabaseConfigured()) {
    let lista = [...mockProdutos];
    if (opts?.categoriaSlug) {
      const cat = mockCategorias.find((c) => c.slug === opts.categoriaSlug);
      if (cat) lista = lista.filter((p) => p.categoria_id === cat.id);
    }
    if (opts?.destaque) lista = lista.filter((p) => p.destaque);
    if (opts?.busca) {
      const q = opts.busca.toLowerCase();
      lista = lista.filter((p) => p.nome.toLowerCase().includes(q));
    }
    return lista.map((p) => ({
      ...p,
      categorias: mockCategorias.find((c) => c.id === p.categoria_id) ?? null,
    }));
  }

  const sb = createSupabaseServerClient();
  let query = sb
    .from("produtos")
    .select("*, categorias(id, nome, slug)")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  if (opts?.categoriaSlug) {
    query = query.eq("categorias.slug", opts.categoriaSlug);
  }
  if (opts?.destaque) {
    query = query.eq("destaque", true);
  }
  if (opts?.busca) {
    query = query.ilike("nome", `%${opts.busca}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[listarProdutos] erro:", error.message);
    return [];
  }
  return (data as ProdutoComCategoria[]) ?? [];
}

export async function obterProdutoPorSlug(
  slug: string,
): Promise<ProdutoComCategoria | null> {
  if (!isSupabaseConfigured()) {
    const p = mockProdutos.find((x) => x.slug === slug);
    if (!p) return null;
    return {
      ...p,
      categorias: mockCategorias.find((c) => c.id === p.categoria_id) ?? null,
    };
  }
  const sb = createSupabaseServerClient();
  const { data, error } = await sb
    .from("produtos")
    .select("*, categorias(id, nome, slug)")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();
  if (error) {
    console.warn("[obterProdutoPorSlug] erro:", error.message);
    return null;
  }
  return (data as ProdutoComCategoria | null) ?? null;
}

export type UnidadeComZonas = Unidade & { zonas: ZonaEntrega[] };

export async function listarUnidadesComZonas(): Promise<UnidadeComZonas[]> {
  if (!isSupabaseConfigured()) {
    return mockUnidades.map((u) => ({
      ...u,
      zonas: u.zonas.filter((z) => z.ativa),
    }));
  }
  const sb = createSupabaseServerClient();
  const { data: unidades, error } = await sb
    .from("unidades")
    .select("*, zonas_entrega(*)")
    .eq("ativa", true)
    .order("created_at", { ascending: true });
  if (error) {
    console.warn("[listarUnidadesComZonas] erro:", error.message);
    return [];
  }
  // O Supabase retorna o relacionamento como "zonas_entrega" (nome da tabela)
  type UnidadeBruta = Omit<Unidade, never> & {
    zonas_entrega?: ZonaEntrega[] | null;
  };
  return (
    ((unidades as unknown as UnidadeBruta[]) ?? [])
      .map((u) => ({
        id: u.id,
        nome: u.nome,
        slug: u.slug,
        endereco: u.endereco,
        whatsapp: u.whatsapp,
        ativa: u.ativa,
        created_at: u.created_at,
        zonas: (u.zonas_entrega ?? []).filter((z) => z.ativa),
      }))
      .filter((u) => u.zonas.length > 0) ?? []
  );
}
