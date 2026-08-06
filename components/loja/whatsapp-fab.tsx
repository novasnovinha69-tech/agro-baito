"use client";

import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { linkWhatsApp } from "@/lib/loja-config";

/**
 * Botão flutuante de WhatsApp (FAB) — fica fixo no canto inferior direito.
 * Padrão profissional de e-commerce brasileiro.
 */
export function WhatsAppFAB() {
  return (
    <a
      href={linkWhatsApp("Olá! Vim pelo site da Agro Mundo Animal e gostaria de atendimento.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg shadow-whatsapp/30 transition-transform hover:scale-110 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
      {/* Pulse ring */}
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 opacity-75" />
      {/* Tooltip no hover (desktop) */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-agro-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:block">
        Fale conosco no WhatsApp
      </span>
    </a>
  );
}
