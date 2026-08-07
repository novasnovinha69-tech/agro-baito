import Link from "next/link";
import { Sprout, Instagram, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { LOJA, LINKS_NAV, linkWhatsApp } from "@/lib/loja-config";

export function FooterLoja() {
  return (
    <footer className="mt-16 border-t bg-agro-blue-dark text-white/90">
      <div className="container-agro grid gap-8 py-12 md:grid-cols-4">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-agro-emerald">
              <Sprout className="h-6 w-6 text-agro-blue-dark" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-extrabold">Agro Baito</p>
              <p className="-mt-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Animal
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">{LOJA.slogan}.</p>
          <p className="mt-2 text-sm text-white/70">
            Rações · Petiscos · Medicamentos · Pesca · Ferramentas · Agro
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Navegue
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Unidades */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Nossas lojas
          </h4>
          <ul className="mt-3 space-y-3 text-sm">
            {LOJA.unidades.map((u) => (
              <li key={u.nome} className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                <span>
                  <strong className="block">{u.nome}</strong>
                  <span className="text-white/70">{u.endereco}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato + horário */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Fale conosco
          </h4>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a
                href={linkWhatsApp("Olá! Vim pelo site da Agro Baito.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                WhatsApp: {LOJA.telefone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-white" />
              <span>
                <strong className="block text-white">Horário</strong>
                <span className="text-white/70">
                  {LOJA.horarioAtendimento}
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white" /> {LOJA.telefone}
            </li>
            <li>
              <a
                href={LOJA.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <Instagram className="h-4 w-4 text-white" /> @insta_baito
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-agro flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {LOJA.nome}. Todos os direitos reservados.
          </p>
          <p>
            Pagamento via Pix · Entrega própria em {LOJA.cidade} e região
          </p>
        </div>
      </div>
    </footer>
  );
}
