"use client";

import {
  LayoutDashboard,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Sprout,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BotaoWhatsAppLojas } from "@/components/loja/botao-whatsapp-lojas";
import { BotaoAvaliacaoGoogle } from "@/components/shared/botao-avaliacao-google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LINKS_NAV, LOJA, linkWhatsApp } from "@/lib/loja-config";
import { useCarrinho } from "@/lib/store/carrinho";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function HeaderLoja() {
  const pathname = usePathname();
  const totalItens = useCarrinho((s) =>
    s.itens.reduce((a, i) => a + i.quantidade, 0),
  );
  const abrirCarrinho = useCarrinho((s) => s.abrir);
  const [busca, setBusca] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checar() {
      try {
        const sb = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await sb.auth.getSession();
        if (!session) return;
        const { data } = await sb
          .from("admins")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (mounted) setIsAdmin(!!data);
      } catch {
        // ignore
      }
    }
    checar();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Faixa superior — contato */}
      <div className="hidden bg-agro-blue text-white md:block">
        <div className="container-agro flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {LOJA.cidade}
            </span>
            <a
              href={`https://wa.me/${LOJA.whatsappNumero}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" /> {LOJA.telefone}
            </a>
          </div>
          <span className="flex items-center gap-1">
            <Sprout className="h-3.5 w-3.5" /> Entregas em {LOJA.regiao}
          </span>
        </div>
      </div>

      {/* Linha principal */}
      <div className="container-agro flex h-16 items-center gap-3 md:h-20">
        {/* Menu mobile (hambúrguer) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-agro-blue">
                <Sprout className="h-5 w-5" /> {LOJA.nome}
              </SheetTitle>
            </SheetHeader>
            {/* Links institucionais no menu mobile */}
            <nav className="mt-2 flex flex-col gap-1 border-t pt-2">
              <Link
                href="/sobre"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Sobre nós
              </Link>
              <Link
                href="/contato"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Contato
              </Link>
              <Link
                href="/conta"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Minha conta
              </Link>
            </nav>
            <nav className="mt-4 flex flex-col gap-1">
              {LINKS_NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                    pathname === l.href && "bg-muted text-agro-blue",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo Agro Baito */}
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-agro-gradient">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-extrabold text-agro-blue-dark md:text-lg">
              {LOJA.nome}
            </p>
            <p className="-mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-xs">
              {LOJA.slogan}
            </p>
          </div>
        </Link>

        {/* Busca (desktop) */}
        <form
          action="/buscar"
          className="mx-auto hidden w-full max-w-xl md:block"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Busque por ração, medicamento, ferramenta..."
              className="pl-9"
            />
          </div>
        </form>

        {/* Ações */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {/* Busca mobile */}
          <Link href="/buscar" className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {/* Botão avaliação Google (logo oficial) */}
          <BotaoAvaliacaoGoogle
            variant="compacto"
            className="shrink-0 transition-transform hover:scale-110"
          />

          {/* Botão WhatsApp com seletor de lojas (desktop) */}
          <div className="hidden md:block">
            <BotaoWhatsAppLojas variant="simples" />
          </div>

          {/* Minha conta (cliente) */}
          <Link href="/conta" aria-label="Minha conta">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-agro-blue"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Conta</span>
            </Button>
          </Link>

          {/* Botão Painel (só admin) */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-agro-blue"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Painel</span>
              </Button>
            </Link>
          )}

          {/* Carrinho */}
          <Button
            variant="ghost"
            size="icon"
            onClick={abrirCarrinho}
            className="relative"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItens > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-agro-blue-light px-1 text-[10px] font-bold text-white">
                {totalItens}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Nav desktop — categorias */}
      <nav className="hidden border-t bg-card md:block">
        <div className="container-agro flex h-11 items-center gap-1">
          {LINKS_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === l.href && "bg-muted font-semibold text-agro-blue",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
