"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { LOJA } from "@/lib/loja-config";

/**
 * Botão WhatsApp que mostra SELETOR DE LOJAS.
 * Cada loja tem seu próprio número — cliente escolhe qual quer falar.
 *
 * Agora usa LOJA.unidades (config central) em vez de dados hardcoded.
 * Cada unidade precisa ter: nome, whatsapp, telefone, endereco.
 */
type LojaWhatsApp = {
  nome: string;
  numero: string; // DDI+DDD+numero
  telefone: string;
  endereco: string;
};

function lojasDoConfig(): LojaWhatsApp[] {
  return LOJA.unidades.map((u) => ({
    nome: u.nome,
    numero: u.whatsapp ?? LOJA.whatsappNumero,
    telefone: u.telefone ?? LOJA.telefone,
    endereco: u.endereco,
  }));
}

export function BotaoWhatsAppLojas({
  variant = "completo",
  className = "",
}: {
  variant?: "completo" | "simples";
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const lojas = lojasDoConfig();

  function abrirWhatsapp(numero: string) {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(
      LOJA.heroTextoBotao,
    )}`;
    window.open(url, "_blank");
    setAberto(false);
  }

  if (variant === "simples") {
    // Versão simples (header) — mostra dropdown ao clicar
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          className="flex items-center gap-1.5 rounded-full bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
          aria-label="Falar no WhatsApp"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          WhatsApp
          <ChevronDown
            className={`h-3 w-3 transition-transform ${aberto ? "rotate-180" : ""}`}
          />
        </button>

        {aberto && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setAberto(false)}
            />
            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border bg-white shadow-xl">
              <div className="bg-agro-green px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
                Escolha a loja
              </div>
              {lojas.map((loja) => (
                <button
                  type="button"
                  key={loja.nome}
                  onClick={() => abrirWhatsapp(loja.numero)}
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted"
                >
                  <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-whatsapp" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-agro-navy">
                      {loja.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {loja.telefone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Versão completa (card de destaque, ex: home)
  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-whatsapp/10">
          <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-agro-navy">
            Fale com a gente
          </h3>
          <p className="text-xs text-muted-foreground">
            Escolha a loja mais próxima:
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {lojas.map((loja) => (
          <button
            type="button"
            key={loja.nome}
            onClick={() => abrirWhatsapp(loja.numero)}
            className="flex w-full items-center gap-3 rounded-lg border border-agro-green/20 bg-agro-green/5 p-3 text-left transition-all hover:border-whatsapp hover:bg-whatsapp/5"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-whatsapp">
              <WhatsAppIcon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-agro-navy">
                {loja.nome}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{loja.endereco}</span>
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold text-whatsapp">
              {loja.telefone}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        ⏰ {LOJA.horarioAtendimento}
      </p>
    </div>
  );
}
