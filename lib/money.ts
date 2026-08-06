/** Formata um valor EM CENTAVOS como moeda brasileira (R$). */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((cents || 0) / 100);
}

/** Formata um número decimal comum como R$ (ex: preço por kg). */
export function formatBRLValue(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

/** Soma um array de centavos. */
export function sumCents(values: number[]): number {
  return values.reduce((acc, v) => acc + (v || 0), 0);
}

/** Aplica um desconto percentual sobre um valor em centavos. Retorna centavos. */
export function applyPercent(cents: number, percent: number): number {
  return Math.round((cents * (percent || 0)) / 100);
}

/** Máscara de telefone (47) 99895-3365 a partir de só dígitos. */
export function maskPhone(digits: string): string {
  const d = (digits ?? "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Máscara de CEP 88000-000. */
export function maskCEP(digits: string): string {
  const d = (digits ?? "").replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** Máscara de CPF 000.000.000-00 ou CNPJ 00.000.000/0000-00. */
export function maskCpfCnpj(value: string): string {
  const d = (value ?? "").replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
    8,
    12,
  )}-${d.slice(12)}`;
}

/** Formata um peso (kg) bonito: 1,5 kg / 20 kg / 0,5 kg. */
export function formatPeso(kg: number | null | undefined): string {
  if (!kg) return "";
  const txt = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(kg);
  return `${txt} kg`;
}
