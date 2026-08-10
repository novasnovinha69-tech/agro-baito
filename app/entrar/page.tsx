"use client";

import { AlertCircle, LogIn, Sprout } from "lucide-react";
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
  const proximaPagina = params.get("next") ?? "/admin";
  const erroParam = params.get("erro");
  const configurado = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(
    erroParam === "sem_permissao"
      ? "Você não tem permissão de administrador."
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
      router.push(proximaPagina);
      router.refresh();
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar. Verifique email e senha.",
      );
    } finally {
      setCarregando(false);
    }
  }

  // Modo demo (sem Supabase): acesso direto ao admin com dados mockados
  if (!configurado) {
    return (
      <div className="container-agro grid place-items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10">
              <Sprout className="h-7 w-7 text-agro-blue" />
            </div>
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription>
              Modo demonstração — o site não está conectado ao banco de dados
              ainda. Após conectar o Supabase, o login real funcionará aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">
                Para acessar agora (demo):
              </p>
              <p>
                Você pode entrar no painel admin para ver como vai ficar. Os
                dados são de exemplo e <strong>não ficam salvos</strong>.
              </p>
            </div>
            <Button asChild className="w-full" size="lg">
              <a href="/admin">
                <LogIn className="h-5 w-5" /> Entrar no painel (demo)
              </a>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Para login real, conecte o Supabase (ver DOCUMENTACAO.md).
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
          <CardTitle>Painel Administrativo</CardTitle>
          <CardDescription>Agro Baito — acesso restrito</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={entrar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agrobaito.com.br"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
