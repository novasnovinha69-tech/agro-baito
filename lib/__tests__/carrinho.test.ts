import { describe, expect, it } from "vitest";
import type { Produto } from "@/types/database.types";
import {
  precoEfetivoCents,
  precoPorUnidadeCents,
  temPromocao,
} from "../carrinho";

// Fabrica de produto para reduzir boilerplate
function produto(partial: Partial<Produto>): Produto {
  return {
    id: "p1",
    nome: "Racao Teste",
    slug: "racao-teste",
    descricao: null,
    foto_url: null,
    categoria_id: "c1",
    preco_cents: 10000,
    preco_promocional_cents: null,
    preco_por_kg: false,
    peso_kg: null,
    unidade_medida: "un",
    qtd_minima: 1,
    multiplo: 1,
    estoque: 100,
    estoque_minimo: 10,
    destaque: false,
    created_at: "",
    ...partial,
  } as Produto;
}

describe("carrinho — helpers de preco", () => {
  describe("precoEfetivoCents", () => {
    it("retorna preco promocional quando existe", () => {
      const p = produto({
        preco_cents: 10000,
        preco_promocional_cents: 8000,
      });
      expect(precoEfetivoCents(p)).toBe(8000);
    });

    it("retorna preco normal quando nao ha promocional (null)", () => {
      const p = produto({ preco_cents: 10000, preco_promocional_cents: null });
      expect(precoEfetivoCents(p)).toBe(10000);
    });

    it("retorna preco normal quando promocional e undefined", () => {
      const p = produto({
        preco_cents: 5000,
        preco_promocional_cents: undefined,
      });
      expect(precoEfetivoCents(p)).toBe(5000);
    });
  });

  describe("temPromocao", () => {
    it("true quando promocional existe e e menor que o normal", () => {
      expect(
        temPromocao(
          produto({ preco_cents: 10000, preco_promocional_cents: 8000 }),
        ),
      ).toBe(true);
    });

    it("false quando promocional e null", () => {
      expect(
        temPromocao(
          produto({ preco_cents: 10000, preco_promocional_cents: null }),
        ),
      ).toBe(false);
    });

    it("false quando promocional nao e menor que o normal", () => {
      // promocional >= normal nao conta como promocao
      expect(
        temPromocao(
          produto({ preco_cents: 5000, preco_promocional_cents: 5000 }),
        ),
      ).toBe(false);
      expect(
        temPromocao(
          produto({ preco_cents: 5000, preco_promocional_cents: 6000 }),
        ),
      ).toBe(false);
    });
  });

  describe("precoPorUnidadeCents", () => {
    it("calcula preco por kg quando peso_kg e preco_por_kg existem", () => {
      const p = produto({
        preco_cents: 20000, // R$ 200
        preco_por_kg: true,
        peso_kg: 20,
      });
      // R$200 / 20kg = R$10/kg = 1000 cents/kg
      expect(precoPorUnidadeCents(p)).toBe(1000);
    });

    it("retorna null quando nao e preco por kg", () => {
      expect(
        precoPorUnidadeCents(produto({ preco_por_kg: false, peso_kg: 10 })),
      ).toBeNull();
    });

    it("retorna null quando peso_kg e null", () => {
      expect(
        precoPorUnidadeCents(produto({ preco_por_kg: true, peso_kg: null })),
      ).toBeNull();
    });

    it("usa preco promocional quando aplicavel", () => {
      const p = produto({
        preco_cents: 20000,
        preco_promocional_cents: 10000,
        preco_por_kg: true,
        peso_kg: 10,
      });
      // R$100 / 10kg = R$10/kg = 1000 cents/kg
      expect(precoPorUnidadeCents(p)).toBe(1000);
    });
  });
});
