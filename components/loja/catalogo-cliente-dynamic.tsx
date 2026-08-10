"use client";

import dynamic from "next/dynamic";
import type { Produto, Categoria } from "@/types/database.types";
import { ProductCardGridSkeleton } from "@/components/loja/product-card-skeleton";

/**
 * CatalogoCliente (client component com filtros, ordenacao, busca) carregado
 * via next/dynamic para code-split. SSR mantido para SEO/primeira pintura.
 *
 * Motion principle (Emil - performance): lazy load de codigo nao critico.
 *
 * Este wrapper existe para ser reutilizado pelas 3 rotas que usam o catalogo:
 * /catalogo, /buscar, /categoria/[slug].
 */
export const CatalogoCliente = dynamic(
  () =>
    import("@/components/loja/catalogo-cliente").then(
      (m) => m.CatalogoCliente,
    ),
  {
    ssr: true,
    loading: () => (
      <div className="container-agro py-6">
        <ProductCardGridSkeleton count={12} />
      </div>
    ),
  },
);

export type CatalogoClienteProps = {
  produtos: Produto[];
  categorias: Categoria[];
  categoriaAtivaSlug?: string;
  buscaInicial?: string;
};
