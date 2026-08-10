"use client";

import { BannerDemonstracao } from "@/components/loja/banner-demostracao";
import { CartDrawer } from "@/components/loja/cart-drawer";
import { FooterLoja } from "@/components/loja/footer-loja";
import { HeaderLoja } from "@/components/loja/header-loja";
import { WhatsAppFAB } from "@/components/loja/whatsapp-fab";

/**
 * Envoltório da loja pública: banner demo, header fixo, conteúdo, footer e
 * drawer do carrinho.
 */
export function LojaShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BannerDemonstracao />
      <HeaderLoja />
      <main className="flex-1">{children}</main>
      <FooterLoja />
      <CartDrawer />
      <WhatsAppFAB />
    </>
  );
}
