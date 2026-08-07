"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { MapPin, ChevronDown, Store } from "lucide-react";
import { LOJA, linkWhatsApp } from "@/lib/loja-config";

/**
 * Botão WhatsApp que mostra SELETOR DE LOJAS.
 * Cada loja tem seu próprio número — cliente escolhe qual quer falar.
 *
 * Números das lojas da Agro Baito:
 *  - Perequê (Porto Belo): (47) 99717-4539
 *  - Bombas (Bombinhas):   (47) 99996-3657
 *  - Meia Praia (Itapema): (47) 99717-4539
 */
type LojaWhatsApp = {
  nome: string;
  numero: string; // DDI+DDD+numero
  telefone: string; // formato exibido
  endereco: string;
};

const LOJAS_WHATSAPP: LojaWhatsApp[] = [
  {
    nome: "Loja Perequê (Porto Belo)",
    numero: "5547997174539",
    telefone: "(47) 99717-4539",
    endereco: "Av. Gov. Celso Ramos, 1187 — Perequê, Porto Belo/SC",
  },
  {
    nome: "Loja Bombas (Bombinhas)",
    numero: "5547999963657",
    telefone: "(47) 99996-3657",
    endereco: "Av. Leopoldo Zarling, 2072 — Bombas, Bombinhas/SC",
  },
  {
    nome: "Loja Meia Praia (Itapema)",
    numero: "5547997174539",
    telefone: "(47) 99717-4539",
    endereco: "Av. Nereu Ramos, 330 — Meia Praia, Itapema/SC",
  },
];

export function BotaoWhatsAppLojas({
  variant = "completo",
  className = "",
}: {
  variant?: "completo" | "simples";
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);

  function abrirWhatsapp(numero: string) {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(
      `Olá! Vim pelo site da Agro Baito e gostaria de atendimento.`,
    )}`;
    window.open(url, "_blank");
    setAberto(false);
  }

  if (variant === "simples") {
    // Versão simples (header) — mostra dropdown ao clicar
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setAberto(!aberto)}
          className="flex items-center gap-1.5 rounded-full bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
          aria-label="Falar no WhatsApp"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          WhatsApp
          <ChevronDown className={`h-3 w-3 transition-transform ${aberto ? "rotate-180" : ""}`} />
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
              {LOJAS_WHATSAPP.map((loja) => (
                <button
                  key={loja.nome}
                  onClick={() => abrirWhatsapp(loja.numero)}
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted"
                >
                  <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-whatsapp" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-agro-navy">{loja.nome}</p>
                    <p className="text-xs text-muted-foreground">{loja.telefone}</p>
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
        {LOJAS_WHATSAPP.map((loja) => (
          <button
            key={loja.nome}
            onClick={() => abrirWhatsapp(loja.numero)}
            className="flex w-full items-center gap-3 rounded-lg border border-agro-green/20 bg-agro-green/5 p-3 text-left transition-all hover:border-whatsapp hover:bg-whatsapp/5"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-whatsapp">
              <WhatsAppIcon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-agro-navy">{loja.nome}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{loja.endereco}</span>
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold text-whatsapp">{loja.telefone}</span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        ⏰ {LOJA.horarioAtendimento}
      </p>
    </div>
  );
}
