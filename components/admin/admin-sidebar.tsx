"use client";

import {
  AlertTriangle,
  Crown,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Sprout,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/auth-server";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { LOJA } from "@/lib/loja-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ItemMenu = {
  href: string;
  label: string;
  icon: React.ElementType;
  // 'master' = só master vê; 'admin' = qualquer admin vê
  acesso: "master" | "admin";
};

const LINKS: ItemMenu[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    acesso: "admin",
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    acesso: "admin",
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    icon: ShoppingCart,
    acesso: "admin",
  },
  {
    href: "/admin/estoque",
    label: "Estoque",
    icon: AlertTriangle,
    acesso: "admin",
  },
  {
    href: "/admin/zonas-entrega",
    label: "Zonas de Entrega",
    icon: Truck,
    acesso: "admin",
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings,
    acesso: "master",
  },
];

export function AdminSidebar({ role, nome }: { role: Role; nome?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const configurado = isSupabaseConfigured();
  const ehMaster = role === "master";

  // Filtra itens pela role
  const linksVisiveis = configurado
    ? LINKS.filter((l) => l.acesso === "admin" || ehMaster)
    : LINKS; // modo demo: mostra tudo

  async function sair() {
    if (!configurado) {
      router.push("/");
      return;
    }
    const sb = createSupabaseBrowserClient();
    await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-agro-navy text-white/90 md:flex md:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-agro-blue-light">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">{LOJA.nome}</p>
          <p className="-mt-0.5 text-[10px] uppercase tracking-wider text-white/60">
            Admin
          </p>
        </div>
      </div>

      {/* Usuário logado + badge de role */}
      {configurado && nome && (
        <div className="border-b border-white/10 px-5 py-3">
          <p className="truncate text-xs text-white/60">Logado como</p>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="truncate text-sm font-medium">{nome}</p>
            {ehMaster ? (
              <Badge
                variant="default"
                className="shrink-0 gap-1 bg-agro-amber/90 text-agro-navy"
              >
                <Crown className="h-3 w-3" /> Master
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 border-white/30">
                Loja
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <nav className="flex-1 space-y-1 p-3">
        {linksVisiveis.map((link) => {
          const ativo =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                ativo
                  ? "bg-agro-blue text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {link.label}
              {link.acesso === "master" && (
                <Crown className="ml-auto h-3 w-3 text-agro-amber/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Aviso para admin comum */}
      {configurado && !ehMaster && (
        <div className="mx-3 mb-3 rounded-lg bg-white/5 p-3 text-[11px] leading-snug text-white/50">
          Você é administrador da loja. Algumas áreas (com ícone 👑) são
          restritas ao master.
        </div>
      )}

      {/* Rodapé */}
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Home className="h-4.5 w-4.5" /> Ver loja
        </Link>
        <button
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" /> Sair
        </button>
      </div>
    </aside>
  );
}

/** Topbar mobile do admin */
export function AdminTopbar({ role, nome }: { role: Role; nome?: string }) {
  const pathname = usePathname();
  const ehMaster = role === "master";
  const linksVisiveis = isSupabaseConfigured()
    ? LINKS.filter((l) => l.acesso === "admin" || ehMaster)
    : LINKS;

  return (
    <div className="flex h-14 items-center justify-between border-b bg-agro-navy px-4 text-white md:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <Sprout className="h-5 w-5 shrink-0 text-agro-blue-light" />
        <div className="min-w-0 leading-tight">
          <span className="block font-display text-sm font-bold">
            {LOJA.nome}
          </span>
          {nome ? (
            <span className="flex items-center gap-1 text-[10px] text-white/70">
              {ehMaster ? (
                <>
                  <Crown className="h-3 w-3 text-agro-amber" />
                  <span className="truncate">{nome}</span> · Master
                </>
              ) : (
                <span className="truncate">{nome} · Loja</span>
              )}
            </span>
          ) : (
            <span className="text-[10px] text-white/70">Admin</span>
          )}
        </div>
      </div>
      <select
        onChange={(e) => (window.location.href = e.target.value)}
        value={pathname}
        className="max-w-[55%] rounded border border-white/20 bg-white/10 px-2 py-1 text-sm"
      >
        {linksVisiveis.map((l) => (
          <option key={l.href} value={l.href} className="text-black">
            {l.label}
            {l.acesso === "master" ? " 👑" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
