// =============================================================================
//  BUSCA DE CEP — usa a API gratuita do ViaCEP (Correios), sem chave/custo.
//  Documentação: https://viacep.com.br
// =============================================================================

export type EnderecoViaCep = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
  ibge: string;
};

/**
 * Busca endereço pelo CEP. Retorna null se não achar.
 * Gratuita, sem chave, sem limite prático para uso normal.
 */
export async function buscarCep(cep: string): Promise<EnderecoViaCep | null> {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;

  try {
    const resp = await fetch(
      `https://viacep.com.br/ws/${limpo}/json/`,
      { next: { revalidate: 86400 } }, // cache 24h
    );
    if (!resp.ok) return null;
    const data = (await resp.json()) as EnderecoViaCep & { erro?: boolean };
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Casar o endereço do cliente com uma zona de entrega.
 * Compara bairro e cidade (case-insensitive, sem acento) com o campo "valor"
 * de cada zona. Retorna a zona mais específica que casar.
 *
 * Regra de prioridade: retirada < bairro < cidade.
 */
export function casarZonaPorEndereco(
  endereco: { bairro?: string; localidade?: string; cidade?: string },
  zonas: { id: string; tipo: string; valor: string }[],
): { id: string; tipo: string; valor: string } | null {
  const norm = (s: string | undefined) =>
    (s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const bairroNorm = norm(endereco.bairro);
  const cidadeNorm = norm(endereco.localidade ?? endereco.cidade);

  // 1) Tenta casar bairro exato
  let zona = zonas.find(
    (z) => z.tipo === "bairro" && norm(z.valor) === bairroNorm,
  );
  if (zona) return zona;
  // 2) Bairro parcial (zona valor contida no bairro ou vice-versa)
  zona = zonas.find(
    (z) =>
      z.tipo === "bairro" &&
      bairroNorm &&
      (bairroNorm.includes(norm(z.valor)) ||
        norm(z.valor).includes(bairroNorm)),
  );
  if (zona) return zona;

  // 3) Tenta casar cidade exata
  zona = zonas.find((z) => z.tipo === "cidade" && norm(z.valor) === cidadeNorm);
  if (zona) return zona;
  // 4) Cidade parcial
  zona = zonas.find(
    (z) =>
      z.tipo === "cidade" &&
      cidadeNorm &&
      (cidadeNorm.includes(norm(z.valor)) ||
        norm(z.valor).includes(cidadeNorm)),
  );
  return zona ?? null;
}
