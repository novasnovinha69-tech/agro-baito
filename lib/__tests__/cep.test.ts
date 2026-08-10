import { beforeEach, describe, expect, it, vi } from "vitest";
import { buscarCep, casarZonaPorEndereco } from "../cep";

describe("cep — casamento de zona por endereco", () => {
  const zonas = [
    { id: "z1", tipo: "bairro", valor: "Perequê" },
    { id: "z2", tipo: "bairro", valor: "Meia Praia" },
    { id: "z3", tipo: "cidade", valor: "Itapema" },
    { id: "z4", tipo: "cidade", valor: "Porto Belo" },
  ];

  it("casamento exato de bairro (com acento)", () => {
    const r = casarZonaPorEndereco({ bairro: "Perequê" }, zonas);
    expect(r?.id).toBe("z1");
  });

  it("casamento de bairro sem acento vs zona com acento (normalizacao)", () => {
    const r = casarZonaPorEndereco({ bairro: "Pereque" }, zonas);
    expect(r?.id).toBe("z1");
  });

  it("casamento case-insensitive de bairro", () => {
    const r = casarZonaPorEndereco({ bairro: "meia praia" }, zonas);
    expect(r?.id).toBe("z2");
  });

  it("casamento parcial de bairro (valor contido no bairro)", () => {
    const r = casarZonaPorEndereco({ bairro: "Meia Praia Centro" }, [
      { id: "z2", tipo: "bairro", valor: "Meia Praia" },
    ]);
    expect(r?.id).toBe("z2");
  });

  it("casamento de cidade quando bairro nao bate", () => {
    const r = casarZonaPorEndereco(
      { bairro: "Bairro Desconhecido", localidade: "Itapema" },
      zonas,
    );
    expect(r?.id).toBe("z3");
  });

  it("casamento de cidade via campo 'cidade' (fallback de localidade)", () => {
    const r = casarZonaPorEndereco({ cidade: "Porto Belo" }, zonas);
    expect(r?.id).toBe("z4");
  });

  it("retorna null quando nada casa", () => {
    const r = casarZonaPorEndereco(
      { bairro: "Lugar Nenhum", localidade: "Cidade Inexistente" },
      zonas,
    );
    expect(r).toBeNull();
  });

  it("prioriza bairro sobre cidade quando ambos casam", () => {
    const r = casarZonaPorEndereco(
      { bairro: "Perequê", localidade: "Porto Belo" },
      zonas,
    );
    expect(r?.id).toBe("z1"); // bairro ganha
  });
});

describe("cep — buscarCep (ViaCEP)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna null para CEP com tamanho invalido", async () => {
    expect(await buscarCep("123")).toBeNull();
    expect(await buscarCep("1234567")).toBeNull(); // 7 digitos
    expect(await buscarCep("123456789")).toBeNull(); // 9 digitos
  });

  it("retorna endereco quando ViaCEP responde com sucesso", async () => {
    const mockData = {
      cep: "88000-000",
      logradouro: "Rua Teste",
      complemento: "",
      bairro: "Centro",
      localidade: "Itapema",
      uf: "SC",
      ibge: "4208204",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const r = await buscarCep("88000000");
    expect(r).toEqual(mockData);
  });

  it("retorna null quando ViaCEP retorna erro (CEP inexistente)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ erro: true }),
      }),
    );

    expect(await buscarCep("00000000")).toBeNull();
  });

  it("retorna null quando fetch lanca excecao", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    expect(await buscarCep("88000000")).toBeNull();
  });
});
