import { describe, expect, it } from "vitest";
import {
  applyPercent,
  formatBRL,
  formatBRLValue,
  formatPeso,
  maskCEP,
  maskCpfCnpj,
  maskPhone,
  sumCents,
} from "../money";

describe("money — formatacao e aritmetica de centavos", () => {
  // Intl.NumberFormat usa NBSP (\u00A0) entre R$ e o valor — usar nas assercoes
  describe("formatBRL", () => {
    it("formata centavos como R$", () => {
      expect(formatBRL(1999)).toBe("R$\u00A019,99");
      expect(formatBRL(100000)).toBe("R$\u00A01.000,00");
      expect(formatBRL(50)).toBe("R$\u00A00,50");
    });

    it("trata zero e undefined como R$ 0,00", () => {
      expect(formatBRL(0)).toBe("R$\u00A00,00");
      // biome-ignore lint/suspicious/noExplicitAny: teste de robustez
      expect(formatBRL(undefined as any)).toBe("R$\u00A00,00");
      // biome-ignore lint/suspicious/noExplicitAny: teste de robustez
      expect(formatBRL(NaN as any)).toBe("R$\u00A00,00");
    });

    it("trata valor negativo", () => {
      expect(formatBRL(-1999)).toBe("-R$\u00A019,99");
    });
  });

  describe("formatBRLValue", () => {
    it("formata valor decimal (nao centavos) como R$", () => {
      expect(formatBRLValue(19.99)).toBe("R$\u00A019,99");
      expect(formatBRLValue(0)).toBe("R$\u00A00,00");
    });
  });

  describe("sumCents", () => {
    it("soma array de centavos", () => {
      expect(sumCents([1000, 2000, 3000])).toBe(6000);
    });

    it("trata valores undefined/null no array como 0", () => {
      // biome-ignore lint/suspicious/noExplicitAny: teste de robustez
      expect(sumCents([1000, undefined as any, 500])).toBe(1500);
    });

    it("retorna 0 para array vazio", () => {
      expect(sumCents([])).toBe(0);
    });
  });

  describe("applyPercent", () => {
    it("aplica percentual sobre centavos", () => {
      expect(applyPercent(10000, 10)).toBe(1000); // 10% de R$100 = R$10
    });

    it("arredonda corretamente", () => {
      // 15% de R$ 33,33 (3333 cents) = 499,95 -> arredonda 500
      expect(applyPercent(3333, 15)).toBe(500);
    });

    it("percentual zero retorna 0", () => {
      expect(applyPercent(10000, 0)).toBe(0);
    });
  });

  describe("maskPhone", () => {
    it("formata telefone com DDD e 9 digitos", () => {
      expect(maskPhone("47997174539")).toBe("(47) 99717-4539");
    });

    it("formata telefone fixo (8 digitos)", () => {
      expect(maskPhone("4733334455")).toBe("(47) 3333-4455");
    });

    it("trata apenas DDD", () => {
      expect(maskPhone("47")).toBe("47");
      expect(maskPhone("479")).toBe("(47) 9");
    });

    it("remove caracteres nao numericos", () => {
      expect(maskPhone("(47) 99717-4539")).toBe("(47) 99717-4539");
    });

    it("limita a 11 digitos", () => {
      expect(maskPhone("47997174539999")).toBe("(47) 99717-4539");
    });
  });

  describe("maskCEP", () => {
    it("formata CEP com traco apos 5 digitos", () => {
      expect(maskCEP("88000000")).toBe("88000-000");
    });

    it("nao adiciona traco com menos de 6 digitos", () => {
      expect(maskCEP("88000")).toBe("88000");
      expect(maskCEP("8800")).toBe("8800");
    });
  });

  describe("maskCpfCnpj", () => {
    it("formata CPF (11 digitos)", () => {
      expect(maskCpfCnpj("12345678901")).toBe("123.456.789-01");
    });

    it("formata CNPJ (14 digitos)", () => {
      expect(maskCpfCnpj("12345678000190")).toBe("12.345.678/0001-90");
    });

    it("formata CPF parcial", () => {
      expect(maskCpfCnpj("123")).toBe("123");
      expect(maskCpfCnpj("123456")).toBe("123.456");
      expect(maskCpfCnpj("123456789")).toBe("123.456.789");
    });
  });

  describe("formatPeso", () => {
    it("formata peso inteiro", () => {
      expect(formatPeso(20)).toBe("20 kg");
    });

    it("formata peso decimal", () => {
      expect(formatPeso(1.5)).toBe("1,5 kg");
      expect(formatPeso(0.5)).toBe("0,5 kg");
    });

    it("retorna string vazia para null/undefined/0", () => {
      expect(formatPeso(null)).toBe("");
      expect(formatPeso(undefined)).toBe("");
      expect(formatPeso(0)).toBe("");
    });
  });
});
