import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  Sparkles,
  Sprout,
  Pill,
  Wheat,
  Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/loja/product-card";
import {
  listarProdutos,
  listarCategorias,
} from "@/lib/data";
import { LOJA, linkWhatsApp } from "@/lib/loja-config";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { BotaoWhatsAppLojas } from "@/components/loja/botao-whatsapp-lojas";
import * as Icons from "lucide-react";

// Ícone por slug de categoria (fallback Package)
const ICONES_CATEGORIA: Record<string, Icons.LucideIcon> = {
  racoes: Wheat,
  "acessorios-pet": Bone,
  veterinaria: Pill,
  higiene: Sparkles,
  jardinagem: Sprout,
  agro: Sprout,
};

// Cartões do hero — ícones vetoriais. Cada card é um LINK pra categoria.
const HERO_CARDS = [
  { icon: Wheat, cor: "text-agro-orange-light", label: "Rações", href: "/categoria/racoes" },
  { icon: Bone, cor: "text-agro-green-bright", label: "Acessórios", href: "/categoria/acessorios-pet" },
  { icon: Pill, cor: "text-agro-orange-light", label: "Veterinária", href: "/categoria/veterinaria" },
  { icon: Sparkles, cor: "text-agro-green-bright", label: "Higiene", href: "/categoria/higiene" },
  { icon: Sprout, cor: "text-agro-orange-light", label: "Jardinagem", href: "/categoria/jardinagem" },
  { icon: Sprout, cor: "text-agro-green-bright", label: "Agro", href: "/categoria/agro" },
];

export default async function HomePage() {
  const [produtos, categorias] = await Promise.all([
    listarProdutos({ destaque: true }),
    listarCategorias(),
  ]);
  const destaques = produtos.slice(0, 8);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="bg-agro-gradient text-white">
        <div className="container-agro grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="badge-agro bg-agro-orange/90 text-white">
                ⭐ 20 ANOS DE TRADIÇÃO
              </span>
              <span className="badge-agro bg-white/20 text-white">
                🚚 Entregas no Litoral Norte
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Somos loucos por <span className="text-agro-orange-light">PET!</span>
              <br />20 anos cuidando do seu melhor amigo.
            </h1>
            <p className="mt-4 max-w-md text-white/85 md:text-lg">
              Há <strong>20 anos</strong> a Agro Baito é referência em rações,
              acessórios pet, veterinária, jardinagem e produtos agro em
              Porto Belo, Bombinhas e Itapema.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/catalogo">
                  Ver catálogo <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <a
                  href={linkWhatsApp(
                    "Olá! Vim pelo site da Agro Baito e gostaria de atendimento.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" /> Falar no WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-agro-orange-light" /> Produtos
                originais
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-4 w-4 text-white" /> Entrega própria
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-white" /> 3 lojas na região
              </span>
            </div>
          </div>

          {/* Grade de cartões com ÍCONES — cada um leva para sua categoria */}
          <div className="grid grid-cols-3 gap-3">
            {HERO_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-white/15 p-3 text-center backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25"
                >
                  <Icon className={`h-9 w-9 ${card.cor}`} strokeWidth={1.8} />
                  <span className="text-xs font-semibold text-white/95 md:text-sm">
                    {card.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BENEFÍCIOS ============ */}
      <section className="border-b bg-card">
        <div className="container-agro grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, titulo: "Entrega rápida", texto: "Litoral Norte" },
            { icon: ShieldCheck, titulo: "Produtos originais", texto: "Qualidade garantida" },
            { icon: Clock, titulo: "Retire na loja", texto: "Perequê, Bombas, Itapema" },
            { icon: MessageCircle, titulo: "Atendimento", texto: "Direto no WhatsApp" },
          ].map((b) => (
            <div key={b.titulo} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-agro-blue/10 text-agro-blue">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.titulo}</p>
                <p className="text-xs text-muted-foreground">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIAS ============ */}
      <section className="container-agro py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-agro-blue-dark md:text-3xl">
              Compre por categoria
            </h2>
            <p className="text-muted-foreground">
              Encontre rápido o que você precisa.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="hidden text-sm font-semibold text-agro-blue hover:underline md:inline"
          >
            Ver tudo →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categorias.map((cat) => {
            const Icon =
              ICONES_CATEGORIA[cat.slug] ??
              (cat.icone
                ? (Icons[cat.icone as keyof typeof Icons] as Icons.LucideIcon)
                : Package);
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-agro-blue hover:shadow-md"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10 text-agro-blue">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium group-hover:text-agro-blue">
                  {cat.nome}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ DESTAQUES ============ */}
      <section className="bg-agro-gray-light py-12">
        <div className="container-agro">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-agro-blue-dark md:text-3xl">
                🔥 Ofertas e destaques
              </h2>
              <p className="text-muted-foreground">
                Selecionados para você economizar.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="hidden text-sm font-semibold text-agro-blue hover:underline md:inline"
            >
              Ver tudo →
            </Link>
          </div>

          {destaques.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nenhum produto em destaque ainda.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {destaques.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA WHATSAPP COM SELETOR DE LOJAS ============ */}
      <section className="container-agro py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-agro-navy md:text-3xl">
              Precisa de ajuda? 🐾
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Fale com a gente no WhatsApp. Nossa equipe é <strong className="text-agro-green-dark">louca por PET</strong> e
              pronta pra ajudar você a escolher o melhor pro seu bichinho,
              jardim ou roça.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-agro-green/10 px-3 py-2 text-sm font-medium text-agro-green-dark">
                🐶 Pet shop completo
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-agro-amber/10 px-3 py-2 text-sm font-medium text-agro-amber-dark">
                🩺 Veterinário na loja
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-agro-green/10 px-3 py-2 text-sm font-medium text-agro-green-dark">
                🚚 Entrega rápida
              </div>
            </div>
          </div>

          {/* Card com os 3 números de WhatsApp por loja */}
          <BotaoWhatsAppLojas variant="completo" />
        </div>
      </section>
    </div>
  );
}
