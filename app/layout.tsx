import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LojaShell } from "@/components/loja/loja-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Agro Mundo Animal — Rações, Medicamentos, Ferragens e Agro em Itapema/SC",
    template: "%s | Agro Mundo Animal",
  },
  description:
    "Rações, petiscos, medicamentos veterinários, pesca, ferramentas, ferragens e insumos agro. Entrega no Vale do Itajaí e Litoral Norte de SC. Retire na loja do Tabuleiro ou do Centro em Itapema.",
  keywords: [
    "agropecuária",
    "ração animal",
    "medicamento veterinário",
    "insumos agrícolas",
    "ferramentas",
    "ferragens",
    "pesca",
    "Itapema",
    "Vale do Itajaí",
    "Tabuleiro dos Oliveiras",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Agro Mundo Animal — Tudo para sua criação e sua roça",
    description: "Entrega rápida em Florianópolis. Pix com desconto. Retire na loja.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <LojaShell>{children}</LojaShell>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
