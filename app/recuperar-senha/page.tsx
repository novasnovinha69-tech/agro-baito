"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// metadata: ver layout.tsx (nao pode exportar metadata em "use client")

export default function RecuperarSenhaPage() {
  const configurado = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function recuperar(e: React.FormEvent) {
    e.preventDefault();
    if (!configurado) {
      toast.info("Modo demonstração — funcione quando o sistema estiver online.");
      return;
    }
    setCarregando(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/entrar`,
      });
      if (error) throw error;
      setEnviado(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao enviar email.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container-agro grid place-items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-agro-blue/10">
            <Mail className="h-7 w-7 text-agro-blue" />
          </div>
          <CardTitle>Recuperar senha</CardTitle>
          <CardDescription>
            Enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enviado ? (
            <div className="rounded-lg bg-agro-emerald/10 p-4 text-center text-sm">
              <p className="font-semibold text-agro-emerald-dark">
                Email enviado! 📧
              </p>
              <p className="mt-1 text-muted-foreground">
                Verifique sua caixa de entrada (e spam) e clique no link para
                redefinir sua senha.
              </p>
            </div>
          ) : (
            <form onSubmit={recuperar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail cadastrado</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={carregando}
              >
                {carregando ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Lembrou a senha?{" "}
            <a href="/entrar" className="font-semibold text-agro-blue hover:underline">
              Entrar
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
