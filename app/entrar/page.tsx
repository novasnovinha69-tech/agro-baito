"use client";

import { AlertCircle, LogIn, Shield, Sprout, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { LOJA } from "@/lib/loja-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function EntrarPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="container-agro py-12 text-center">Carregando...</div>
      }
    >
      <EntrarPage />
    </Suspense>
  );
}

function EntrarPage() {
  const router = useRouter();
  const params = useSearchParams();
  const erroParam = params.get("erro");
  const configurado = isSupabaseConfigured();

  // Toggle cliente/admin — default cliente se ?tipo=cliente, senao admin
  const [tipo, setTipo] = useState<"cliente" | "admin">(
    params.get("tipo") === "cliente" ? "cliente" : "admin",
  );
  const proximaPagina =
    params.get("next") ?? (tipo === "cliente" ? "/conta" : "/admin");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(
    erroParam === "sem_permissao"
      ? "Voce nao tem permissao de administrador."
      : null,
  );

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const sb = createSupabaseBrowserClient();
      const { error } = await sb.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;
      const destino = tipo === "cliente" ? "/conta" : "/admin";
      router.push(destino);
      router.refresh();
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Nao foi possivel entrar. Verifique email e senha.",
      );
    } finally {
      setCarregando(false);
    }
  }

  // Modo demo (sem Supabase)
  if (!configurado) {
    return (
      <div className="container-agro grid place-items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10">
              <Sprout className="h-7 w-7 text-agro-blue" />
            </div>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Modo demonstracao — o site nao esta conectado ao banco de dados
              ainda. Apos conectar o Supabase, o login real funcionara aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">
                Para acessar agora (demo):
              </p>
              <p>
                Voce pode entrar no painel admin para ver como vai ficar. Os
                dados sao de exemplo e <strong>nao ficam salvos</strong>.
              </p>
            </div>
            <Button asChild className="w-full" size="lg">
              <a href="/admin">
                <LogIn className="h-5 w-5" /> Entrar no painel (demo)
              </a>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Para login real, conecte o Supabase.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-agro grid place-items-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10">
            <Sprout className="h-7 w-7 text-agro-blue" />
          </div>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>{LOJA.nome}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle cliente/admin */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo("cliente")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                tipo === "cliente"
                  ? "border-agro-blue bg-agro-blue/5 text-agro-blue"
                  : "text-muted-foreground hover:border-agro-blue/50"
              }`}
            >
              <User className="h-4 w-4" /> Sou cliente
            </button>
            <button
              type="button"
              onClick={() => setTipo("admin")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                tipo === "admin"
                  ? "border-agro-blue bg-agro-blue/5 text-agro-blue"
                  : "text-muted-foreground hover:border-agro-blue/50"
              }`}
            >
              <Shield className="h-4 w-4" /> Administrador
            </button>
          </div>

          <form onSubmit={entrar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {erro && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </Button>

            {tipo === "cliente" && (
              <div className="flex justify-between text-sm">
                <a
                  href="/cadastro"
                  className="font-semibold text-agro-blue hover:underline"
                >
                  Criar conta
                </a>
                <a
                  href="/recuperar-senha"
                  className="text-muted-foreground hover:underline"
                >
                  Esqueci a senha
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
