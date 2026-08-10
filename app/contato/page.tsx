import { MapPin, Clock, MessageCircle, Phone, Instagram } from "lucide-react";
import { LOJA, linkWhatsApp } from "@/lib/loja-config";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export const metadata = {
  title: "Contato",
  description:
    "Fale com a Agro Baito. WhatsApp, telefone e nossas 3 lojas em Porto Belo, Bombinhas e Itapema.",
};

export default function ContatoPage() {
  return (
    <div className="container-agro py-8">
      <h1 className="font-display text-2xl font-bold text-agro-navy md:text-3xl">
        Fale conosco
      </h1>
      <p className="mt-1 text-muted-foreground">
        Estamos prontos para atender você e seu bichinho.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Canais de contato */}
        <div className="space-y-4">
          {/* WhatsApp principal */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-whatsapp/10">
                <MessageCircle className="h-5 w-5 text-whatsapp" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-muted-foreground">
                  {LOJA.telefone}
                </p>
              </div>
            </div>
            <Button asChild variant="whatsapp" className="mt-3 w-full">
              <a
                href={linkWhatsApp(
                  "Olá! Vim pelo site da Agro Baito e gostaria de atendimento.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" /> Abrir WhatsApp
              </a>
            </Button>
          </div>

          {/* Horario */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-agro-blue/10">
                <Clock className="h-5 w-5 text-agro-blue" />
              </div>
              <div>
                <p className="font-semibold">Horário de atendimento</p>
                <p className="text-sm text-muted-foreground">
                  {LOJA.horarioAtendimento}
                </p>
              </div>
            </div>
          </div>

          {/* Telefone */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-agro-blue/10">
                <Phone className="h-5 w-5 text-agro-blue" />
              </div>
              <div>
                <p className="font-semibold">Telefone</p>
                <p className="text-sm text-muted-foreground">{LOJA.telefone}</p>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-agro-orange/10">
                <Instagram className="h-5 w-5 text-agro-orange" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Instagram</p>
                <p className="text-sm text-muted-foreground">@insta_baito</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={LOJA.instagram} target="_blank" rel="noreferrer">
                  Seguir
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Lojas no mapa */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">Nossas lojas</h2>
          {LOJA.unidades.map((u) => {
            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(u.endereco)}&z=15&output=embed`;
            return (
              <div key={u.nome} className="overflow-hidden rounded-xl border">
                <div className="flex items-start gap-2 bg-muted px-4 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-agro-blue" />
                  <div>
                    <p className="font-semibold">{u.nome}</p>
                    <p className="text-sm text-muted-foreground">{u.endereco}</p>
                  </div>
                </div>
                <iframe
                  src={mapsUrl}
                  className="h-40 w-full"
                  loading="lazy"
                  title={`Mapa — ${u.nome}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
