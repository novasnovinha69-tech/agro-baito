import { describe, expect, it } from "vitest";
import type { StatusPedido } from "@/types/database.types";
import { STATUS_INFO, STATUS_ORDEM } from "../status-pedido";

describe("status-pedido — tabelas de status", () => {
  const TODOS_STATUS: StatusPedido[] = [
    "pendente",
    "aguardando_pagamento",
    "confirmado",
    "em_separacao",
    "saiu_para_entrega",
    "entregue",
    "cancelado",
  ];

  describe("STATUS_INFO", () => {
    it("tem entrada para todos os 7 status", () => {
      for (const s of TODOS_STATUS) {
        expect(STATUS_INFO[s]).toBeDefined();
        expect(STATUS_INFO[s].label).toBeTruthy();
        expect(STATUS_INFO[s].variant).toBeTruthy();
        expect(STATUS_INFO[s].cor).toBeTruthy();
      }
    });

    it("nao ha status sobrando", () => {
      expect(Object.keys(STATUS_INFO)).toHaveLength(7);
    });

    it("labels sao legiveis em PT-BR", () => {
      expect(STATUS_INFO.pendente.label).toBe("Pendente");
      expect(STATUS_INFO.aguardando_pagamento.label).toBe(
        "Aguardando Pagamento",
      );
      expect(STATUS_INFO.em_separacao.label).toBe("Em Separação");
      expect(STATUS_INFO.saiu_para_entrega.label).toBe("Saiu p/ Entrega");
      expect(STATUS_INFO.entregue.label).toBe("Entregue");
      expect(STATUS_INFO.cancelado.label).toBe("Cancelado");
    });

    it("variantes sao validas do Badge", () => {
      const variantesValidas = [
        "default",
        "secondary",
        "destructive",
        "outline",
        "promo",
        "success",
        "warn",
      ];
      for (const s of TODOS_STATUS) {
        expect(variantesValidas).toContain(STATUS_INFO[s].variant);
      }
    });

    it("status cancelado usa variante destructive", () => {
      expect(STATUS_INFO.cancelado.variant).toBe("destructive");
    });

    it("status entregue usa variante success", () => {
      expect(STATUS_INFO.entregue.variant).toBe("success");
    });
  });

  describe("STATUS_ORDEM", () => {
    it("tem 7 status na ordem esperada", () => {
      expect(STATUS_ORDEM).toEqual(TODOS_STATUS);
    });

    it("pendente e o primeiro", () => {
      expect(STATUS_ORDEM[0]).toBe("pendente");
    });

    it("cancelado e o ultimo", () => {
      expect(STATUS_ORDEM[STATUS_ORDEM.length - 1]).toBe("cancelado");
    });
  });
});
