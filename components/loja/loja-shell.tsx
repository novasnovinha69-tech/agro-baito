"use client";

import { HeaderLoja } from "@/components/loja/header-loja";
import { FooterLoja } from "@/components/loja/footer-loja";
import { CartDrawer } from "@/components/loja/cart-drawer";
import { WhatsAppFAB } from "@/components/loja/whatsapp-fab";

/** Envoltório da loja pública: header fixo, conteúdo, footer e drawer do carrinho. */
export function LojaShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderLoja />
      <main className="flex-1">{children}</main>
      <FooterLoja />
      <CartDrawer />
      <WhatsAppFAB />
    </>
  );
}
