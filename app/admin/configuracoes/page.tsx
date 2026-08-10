import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth-server";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { LOJA } from "@/lib/loja-config";

export default async function AdminConfigPage() {
  const configurado = isSupabaseConfigured();

  // BLOQUEIO: só master pode acessar configurações
  if (configurado) {
    const { allowed } = await requireRole("master");
    if (!allowed) redirect("/admin/sem-permissao");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-agro-navy">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Dados da loja e status das integrações
        </p>
      </div>

      {/* Status das integrações */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Integrações</CardTitle>
          <CardDescription>
            Conecte cada serviço para liberar funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Linha
            nome="Banco de dados (Supabase)"
            status={configurado ? "ok" : "pendente"}
            detalhe={
              configurado
                ? "Conectado — produtos e pedidos salvos"
                : "Configure o Supabase (ver DOCUMENTACAO.md)"
            }
          />
          <Linha
            nome="Pagamento Pix (Mercado Pago)"
            status={process.env.MP_ACCESS_TOKEN ? "ok" : "pendente"}
            detalhe={
              process.env.MP_ACCESS_TOKEN
                ? "Token configurado"
                : "Adicione MP_ACCESS_TOKEN no .env"
            }
          />
          <Linha
            nome="WhatsApp"
            status={process.env.WHATSAPP_ACCESS_TOKEN ? "ok" : "fallback"}
            detalhe={
              process.env.WHATSAPP_ACCESS_TOKEN
                ? "Cloud API conectada"
                : "Usando link wa.me (fallback). Configure para envio automático."
            }
          />
        </CardContent>
      </Card>

      {/* Dados da loja */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dados da loja</CardTitle>
          <CardDescription>
            Editáveis em{" "}
            <code className="rounded bg-muted px-1">lib/loja-config.ts</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Campo label="Nome" valor={LOJA.nome} />
          <Campo label="Cidade" valor={LOJA.cidade} />
          <Campo label="Região atendida" valor={LOJA.regiao} />
          <Campo label="WhatsApp" valor={LOJA.telefone} />
          <Campo label="Instagram" valor={LOJA.instagram} />
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Unidades
            </p>
            {LOJA.unidades.map((u) => (
              <p key={u.nome} className="mt-1 text-muted-foreground">
                <strong className="text-foreground">{u.nome}:</strong>{" "}
                {u.endereco}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Linha({
  nome,
  status,
  detalhe,
}: {
  nome: string;
  status: "ok" | "pendente" | "fallback";
  detalhe: string;
}) {
  const mapa = {
    ok: { variant: "success" as const, texto: "Conectado" },
    pendente: { variant: "warn" as const, texto: "Pendente" },
    fallback: { variant: "outline" as const, texto: "Fallback" },
  };
  const s = mapa[status];
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{nome}</p>
        <p className="text-xs text-muted-foreground">{detalhe}</p>
      </div>
      <Badge variant={s.variant}>{s.texto}</Badge>
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="text-foreground">{valor}</p>
    </div>
  );
}
