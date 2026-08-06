import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  Fish,
  Hammer,
  Wrench,
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
import * as Icons from "lucide-react";

// Ícone por slug de categoria (fallback Package)
const ICONES_CATEGORIA: Record<string, Icons.LucideIcon> = {
  racoes: Wheat,
  petiscos: Bone,
  medicamentos: Pill,
  pesca: Fish,
  ferramentas: Hammer,
  ferragens: Wrench,
  agro: Sprout,
};

// Cartões do hero — ícones vetoriais (não embaçam em nenhuma resolução)
// Cada card é um LINK que leva para a categoria correspondente
const HERO_CARDS = [
  { icon: Wheat, cor: "text-agro-blue-light", label: "Rações", href: "/categoria/racoes" },
  { icon: Pill, cor: "text-agro-emerald", label: "Veterinário", href: "/categoria/medicamentos" },
  { icon: Fish, cor: "text-sky-400", label: "Pesca", href: "/categoria/pesca" },
  { icon: Hammer, cor: "text-agro-navy", label: "Ferramentas", href: "/categoria/ferramentas" },
  { icon: Wrench, cor: "text-orange-500", label: "Ferragens", href: "/categoria/ferragens" },
  { icon: Sprout, cor: "text-agro-emerald-dark", label: "Agro", href: "/categoria/agro" },
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
            <span className="badge-agro mb-3 bg-white/20 text-white">
              🚚 Entregas no Vale do Itajaí e Litoral Norte
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Tudo para sua <span className="text-white">criação</span> e
              sua <span className="text-white">roça</span> em um só lugar.
            </h1>
            <p className="mt-4 max-w-md text-white/85 md:text-lg">
              Rações, medicamentos veterinários, ferragens, ferramentas, pesca e
              insumos agro. Retire na loja do <strong>Tabuleiro</strong> em{" "}
              <strong>Itapema</strong> ou peça entrega com frete justo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link href="/catalogo">
                  Ver catálogo <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <a
                  href={linkWhatsApp(
                    "Olá! Vim pelo site e gostaria de atendimento.",
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
                <ShieldCheck className="h-4 w-4 text-white" /> Produtos
                originais
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-4 w-4 text-white" /> Entrega própria
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-white" /> 2 lojas em Itapema
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
            { icon: Truck, titulo: "Entrega rápida", texto: "Vale do Itajaí" },
            { icon: ShieldCheck, titulo: "Produtos originais", texto: "Qualidade garantida" },
            { icon: Clock, titulo: "Retire na loja", texto: "Tabuleiro e Centro" },
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

      {/* ============ CTA WHATSAPP ============ */}
      <section className="container-agro py-12">
        <Card className="overflow-hidden border-0 bg-agro-blue text-white">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:p-10 md:text-left">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-whatsapp">
              <WhatsAppIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold md:text-2xl">
                Precisa de ajuda para escolher?
              </h3>
              <p className="mt-1 text-white/85">
                Fale com a gente no WhatsApp. Atendemos produtores rurais e
                lojistas de toda a região de {LOJA.cidade}.
              </p>
            </div>
            <Button asChild size="xl" variant="whatsapp">
              <a
                href={linkWhatsApp("Olá! Preciso de ajuda para escolher um produto.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chamar no WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
