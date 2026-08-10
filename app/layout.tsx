import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LojaShell } from "@/components/loja/loja-shell";
import { LOJA } from "@/lib/loja-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${LOJA.nome} — Loja online`,
    template: `%s | ${LOJA.nome}`,
  },
  description: LOJA.heroTexto,
  keywords: [
    "loja online",
    "e-commerce",
    "comprar online",
    "entrega",
    LOJA.cidade,
    LOJA.regiao,
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: `${LOJA.nome} — Loja online`,
    description: LOJA.heroTexto,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <LojaShell>{children}</LojaShell>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
