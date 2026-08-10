"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskPhone } from "@/lib/money";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// metadata: ver layout.tsx (nao pode exportar metadata em "use client")

export default function CadastroPage() {
  const router = useRouter();
  const configurado = isSupabaseConfigured();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    if (!configurado) {
      toast.info("Modo demonstração — cadastre quando o sistema estiver online.");
      return;
    }
    setCarregando(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, telefone },
        },
      });
      if (error) throw error;
      if (data.user) {
        toast.success("Conta criada! Verifique seu email para confirmar.");
        router.push("/entrar?tipo=cliente");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao criar conta.",
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
            <UserPlus className="h-7 w-7 text-agro-blue" />
          </div>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Acompanhe seus pedidos e compre mais rápido
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!configurado && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Modo demonstração. O cadastro real funcionará quando o sistema
                estiver conectado.
              </span>
            </div>
          )}
          <form onSubmit={cadastrar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">WhatsApp / Telefone</Label>
              <Input
                id="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(maskPhone(e.target.value))}
                placeholder="(47) 99999-9999"
                inputMode="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={carregando}
            >
              {carregando ? "Criando..." : "Criar conta"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <a href="/entrar?tipo=cliente" className="font-semibold text-agro-blue hover:underline">
              Entrar
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
