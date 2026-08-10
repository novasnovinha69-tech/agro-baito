import { Award, Heart, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { LOJA, linkWhatsApp } from "@/lib/loja-config";

export const metadata = {
  title: "Sobre nós",
  description:
    "Conheça a história e a missão da empresa. Página de demonstração — personalize com os dados reais do seu negócio.",
};

export default function SobrePage() {
  const valores = [
    {
      icon: Heart,
      titulo: "Seu diferencial 1",
      texto:
        "Descreva aqui o que faz sua empresa especial. Este texto é um placeholder — ao contratar, personalizamos com a mensagem real do seu negócio.",
    },
    {
      icon: Award,
      titulo: "Seu diferencial 2",
      texto:
        "Outro ponto forte da sua empresa. Por exemplo: anos de experiência, certificações, prêmios, tradição no mercado.",
    },
    {
      icon: Truck,
      titulo: "Seu diferencial 3",
      texto:
        "Mais um motivo para escolher sua empresa. Exemplo: entrega própria, atendimento personalizado, produtos exclusivos.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-agro-gradient text-white">
        <div className="container-agro py-16 text-center">
          <span className="badge-agro mb-4 inline-block bg-agro-orange/90 text-white">
            ⭐ SEU DIFERENCIAL AQUI
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Sobre a {LOJA.nome}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            {LOJA.heroTexto}
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="container-agro py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {valores.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.titulo}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10 text-agro-blue">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-3 font-display text-lg font-bold">
                  {v.titulo}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{v.texto}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historia */}
      <section className="bg-agro-gray-light py-12">
        <div className="container-agro max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-agro-blue-dark">
            Nossa história
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              Este é um espaço para contar a história da sua empresa — quando
              fundou, como cresceu, quais marcos importantes aconteceram. Ao
              contratar, escrevemos este texto juntos para refletir a trajetória
              real do seu negócio.
            </p>
            <p>
              Hoje são <strong>{LOJA.unidades.length} loja(s)</strong> atendendo
              a região de <strong>{LOJA.regiao}</strong>. Cada uma com seu
              WhatsApp próprio e endereço configurável no painel administrativo.
            </p>
          </div>
        </div>
      </section>

      {/* Lojas */}
      <section className="container-agro py-12">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-agro-blue-dark">
          Nossas lojas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {LOJA.unidades.map((u) => (
            <div key={u.nome} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{u.nome}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{u.endereco}</p>
              {u.telefone && (
                <p className="mt-1 text-sm font-medium text-agro-blue">
                  {u.telefone}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="whatsapp" size="xl">
            <a
              href={linkWhatsApp(LOJA.heroTextoBotao)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" /> Fale conosco no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
