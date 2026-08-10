import { Info } from "lucide-react";
import { MODO_DEMONSTRACAO } from "@/lib/loja-config";

/**
 * Banner de demonstração — aparece no topo do site quando MODO_DEMONSTRACAO = true.
 * Quando o cliente preencher os dados reais no loja-config.ts e trocar para false,
 * este banner desaparece automaticamente.
 */
export function BannerDemonstracao() {
  if (!MODO_DEMONSTRACAO) return null;

  return (
    <div className="bg-agro-orange text-white">
      <div className="container-agro flex items-center justify-center gap-2 py-2 text-center text-xs font-medium md:text-sm">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          <strong>Site de demonstração.</strong> Todos os dados (nome, telefone,
          produtos) são exemplos. Ao contratar, personalizamos tudo com as
          informações reais do seu negócio.
        </span>
      </div>
    </div>
  );
}
