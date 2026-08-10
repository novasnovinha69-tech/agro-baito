"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Produto } from "@/types/database.types";

// =============================================================================
//  Carrinho global (Zustand + persistência em localStorage).
//  Itens armazenam um snapshot do produto para sobreviver a mudanças de estoque.
// =============================================================================

export type ItemCarrinho = {
  produtoId: string;
  slug: string;
  nome: string;
  fotoUrl: string | null;
  precoCents: number; // preço unitário aplicado (promoção se houver)
  precoOriginalCents: number;
  precoPorKg: boolean;
  pesoKg: number | null;
  unidadeMedida: string;
  qtdMinima: number;
  multiplo: number;
  quantidade: number;
  estoque: number; // snapshot no momento da adição
};

type EstadoCarrinho = {
  itens: ItemCarrinho[];
  aberto: boolean; // drawer aberto/fechado

  // ações
  abrir: () => void;
  fechar: () => void;
  alternar: () => void;
  adicionar: (produto: Produto, quantidade?: number) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  remover: (produtoId: string) => void;
  limpar: () => void;
  sincronizarEstoque: (produtos: { id: string; estoque: number }[]) => void;

  // derivados
  totalItens: () => number;
  subtotalCents: () => number;
};

function paraItem(p: Produto, quantidade: number): ItemCarrinho {
  return {
    produtoId: p.id,
    slug: p.slug,
    nome: p.nome,
    fotoUrl: p.foto_url,
    precoCents: p.preco_promocional_cents ?? p.preco_cents,
    precoOriginalCents: p.preco_cents,
    precoPorKg: p.preco_por_kg,
    pesoKg: p.peso_kg ? Number(p.peso_kg) : null,
    unidadeMedida: p.unidade_medida,
    qtdMinima: p.qtd_minima,
    multiplo: p.multiplo,
    quantidade,
    estoque: p.estoque,
  };
}

/** Ajusta a quantidade às regras de qtd mínima e múltiplo. */
function clampQuantidade(
  q: number,
  qtdMinima: number,
  multiplo: number,
): number {
  if (q < qtdMinima) q = qtdMinima;
  if (multiplo > 1) {
    q = Math.ceil(q / multiplo) * multiplo;
  }
  return Math.max(1, q);
}

export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set, get) => ({
      itens: [],
      aberto: false,

      abrir: () => set({ aberto: true }),
      fechar: () => set({ aberto: false }),
      alternar: () => set((s) => ({ aberto: !s.aberto })),

      adicionar: (produto, quantidade = 1) => {
        const q = clampQuantidade(
          quantidade,
          produto.qtd_minima,
          produto.multiplo,
        );
        const itens = [...get().itens];
        const idx = itens.findIndex((i) => i.produtoId === produto.id);
        if (idx >= 0) {
          const novaQtd = Math.min(itens[idx].quantidade + q, produto.estoque);
          itens[idx] = {
            ...itens[idx],
            quantidade: novaQtd,
            estoque: produto.estoque,
          };
        } else {
          itens.push(paraItem(produto, Math.min(q, produto.estoque)));
        }
        set({ itens, aberto: true });
      },

      atualizarQuantidade: (produtoId, quantidade) => {
        const itens = get().itens.map((i) => {
          if (i.produtoId !== produtoId) return i;
          const q = clampQuantidade(quantidade, i.qtdMinima, i.multiplo);
          return { ...i, quantidade: Math.min(Math.max(1, q), i.estoque) };
        });
        set({ itens });
      },

      remover: (produtoId) =>
        set((s) => ({
          itens: s.itens.filter((i) => i.produtoId !== produtoId),
        })),

      limpar: () => set({ itens: [] }),

      sincronizarEstoque: (produtos) =>
        set((s) => ({
          itens: s.itens
            .map((i) => {
              const p = produtos.find((x) => x.id === i.produtoId);
              if (!p) return i;
              const novoEstoque = p.estoque;
              return {
                ...i,
                estoque: novoEstoque,
                quantidade: Math.min(i.quantidade, novoEstoque),
              };
            })
            .filter((i) => i.quantidade > 0),
        })),

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),

      subtotalCents: () =>
        get().itens.reduce((acc, i) => acc + i.precoCents * i.quantidade, 0),
    }),
    {
      name: "ama-carrinho",
      partialize: (s) => ({ itens: s.itens }), // não persiste "aberto"
    },
  ),
);
