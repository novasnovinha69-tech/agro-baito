import { Sprout, Heart, Truck, MapPin, Award } from "lucide-react";
import { LOJA } from "@/lib/loja-config";
import { linkWhatsApp } from "@/lib/loja-config";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export const metadata = {
  title: "Sobre nós",
  description:
    "Há 20 anos a Agro Baito é referência em rações, acessórios pet, veterinária e produtos agro em Porto Belo, Bombinhas e Itapema.",
};

export default function SobrePage() {
  const valores = [
    {
      icon: Heart,
      titulo: "Loucos por PET",
      texto:
        "Tratamos cada animal como se fosse nosso. Paixão por pets em cada atendimento.",
    },
    {
      icon: Award,
      titulo: "20 anos de tradição",
      texto:
        "Duas décadas de confiança, qualidade e serviço no Litoral Norte de SC.",
    },
    {
      icon: Truck,
      titulo: "Entrega própria",
      texto:
        "Frota própria para entregar rápido em Porto Belo, Bombinhas e Itapema.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-agro-gradient text-white">
        <div className="container-agro py-16 text-center">
          <span className="badge-agro mb-4 inline-block bg-agro-orange/90 text-white">
            ⭐ 20 ANOS DE TRADIÇÃO
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Somos loucos por PET! 🐾
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Há <strong>20 anos</strong> a Agro Baito é referência em rações,
            acessórios pet, veterinária, jardinagem e produtos agro em Porto
            Belo, Bombinhas e Itapema.
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
              Tudo começou há 20 anos, com um sonho simples: oferecer produtos de
              qualidade e atendimento de verdade para quem ama animais e tem uma
              roça para cuidar. O que era uma loja pequena no Perequê, em Porto
              Belo, virou referência em todo o Litoral Norte de Santa Catarina.
            </p>
            <p>
              Hoje são <strong>3 lojas</strong> — Perequê (Porto Belo), Bombas
              (Bombinhas) e Meia Praia (Itapema) — atendendo milhares de clientes
              que confiam na gente para tudo que seus bichinhos, jardins e
              propriedades precisam.
            </p>
            <p>
              Somos <strong className="text-agro-green-dark">loucos por PET</strong>{" "}
              e orgulhosos de ser parte da vida das famílias da nossa região. E
              agora estamos online para servir ainda melhor!
            </p>
          </div>
        </div>
      </section>

      {/* Lojas */}
      <section className="container-agro py-12">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-agro-blue-dark">
          Nossas 3 lojas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {LOJA.unidades.map((u) => (
            <div key={u.nome} className="rounded-xl border bg-card p-5">
              <MapPin className="h-6 w-6 text-agro-blue" />
              <h3 className="mt-2 font-semibold">{u.nome}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{u.endereco}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="whatsapp" size="xl">
            <a
              href={linkWhatsApp(
                "Olá! Vim pelo site da Agro Baito e gostaria de atendimento.",
              )}
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
