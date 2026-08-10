import { describe, expect, it } from "vitest";
import type { ZonaEntrega } from "@/types/database.types";
import {
  calcularFretePorZona,
  descricaoTipoZona,
  FRETE_GRATIS_MIN_CENTS,
} from "../frete";

// Fabrica de zona para reduzir boilerplate nos testes
function zona(partial: Partial<ZonaEntrega>): ZonaEntrega {
  return {
    id: "z1",
    unidade_id: "u1",
    tipo: "cidade",
    valor: "Itapema",
    frete_percentual: 10,
    prazo_horas: 24,
    ativa: true,
    created_at: "",
    ...partial,
  } as ZonaEntrega;
}

describe("frete — calculo de frete por zona", () => {
  describe("FRETE_GRATIS_MIN_CENTS", () => {
    it("e R$ 1.000,00 (100000 cents)", () => {
      expect(FRETE_GRATIS_MIN_CENTS).toBe(100000);
    });
  });

  describe("calcularFretePorZona", () => {
    it("retorna nao atendido quando zonaId e null", () => {
      const r = calcularFretePorZona(5000, null, []);
      expect(r.atendido).toBe(false);
      expect(r.freteCents).toBe(0);
      expect(r.mensagem).toContain("Selecione");
    });

    it("retorna nao atendido quando zona nao existe na lista", () => {
      const r = calcularFretePorZona(5000, "inexistente", [
        zona({ id: "outra" }),
      ]);
      expect(r.atendido).toBe(false);
      expect(r.mensagem).toContain("Não atendemos");
    });

    it("retorna nao atendido quando zona esta inativa", () => {
      const r = calcularFretePorZona(5000, "z1", [zona({ ativa: false })]);
      expect(r.atendido).toBe(false);
      expect(r.mensagem).toContain("Não atendemos");
    });

    it("calcula frete como % sobre o subtotal", () => {
      const z = zona({ frete_percentual: 10 });
      const r = calcularFretePorZona(10000, "z1", [z]);
      expect(r.atendido).toBe(true);
      expect(r.freteCents).toBe(1000); // 10% de R$100 = R$10
      expect(r.prazoHoras).toBe(24);
      expect(r.zona).toBe(z);
    });

    it("frete zero para zona de retirada (percentual 0)", () => {
      const z = zona({ tipo: "retirada", frete_percentual: 0 });
      const r = calcularFretePorZona(10000, "z1", [z]);
      expect(r.atendido).toBe(true);
      expect(r.freteCents).toBe(0);
    });

    it("arredonda o frete para inteiro", () => {
      // 7% de R$ 10,00 (1000 cents) = 70
      const z = zona({ frete_percentual: 7 });
      const r = calcularFretePorZona(1000, "z1", [z]);
      expect(r.freteCents).toBe(70);
    });
  });

  describe("descricaoTipoZona", () => {
    it("retorna 'Retirada na loja' para retirada", () => {
      expect(descricaoTipoZona(zona({ tipo: "retirada" }))).toBe(
        "Retirada na loja",
      );
    });

    it("retorna 'Entrega no bairro' para bairro", () => {
      expect(descricaoTipoZona(zona({ tipo: "bairro" }))).toBe(
        "Entrega no bairro",
      );
    });

    it("retorna 'Entrega na cidade' para cidade", () => {
      expect(descricaoTipoZona(zona({ tipo: "cidade" }))).toBe(
        "Entrega na cidade",
      );
    });

    it("fallback 'Entrega' para tipo desconhecido", () => {
      // biome-ignore lint/suspicious/noExplicitAny: teste de fallback
      expect(descricaoTipoZona(zona({ tipo: "outro" as any }))).toBe("Entrega");
    });
  });
});
