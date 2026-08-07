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
    default: "Agro Baito — Rações, Veterinária e Pet em Porto Belo, Bombinhas e Itapema/SC",
    template: "%s | Agro Baito",
  },
  description:
    "Rações, acessórios pet, veterinária, higiene, jardinagem e produtos agro. Somos loucos por PET! Entrega em Porto Belo, Bombinhas e Itapema. Retire nas lojas do Perequê, Bombas ou Meia Praia.",
  keywords: [
    "agropecuária",
    "pet shop",
    "ração",
    "veterinário",
    "acessórios pet",
    "Porto Belo",
    "Bombinhas",
    "Itapema",
    "Perequê",
    "Litoral Norte SC",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Agro Baito — Tudo para sua criação e sua roça",
    description: "Entrega em Porto Belo, Bombinhas e Itapema. Pix com desconto. Retire na loja.",
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
