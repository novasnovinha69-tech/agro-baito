"use client";

import { Loader2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { STATUS_INFO, STATUS_ORDEM } from "@/lib/status-pedido";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { StatusPedido } from "@/types/database.types";

export function StatusControle({
  pedidoId,
  statusAtual,
}: {
  pedidoId: string;
  statusAtual: StatusPedido;
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState<StatusPedido | null>(null);
  const configurado = isSupabaseConfigured();

  async function mudarStatus(novo: StatusPedido) {
    setSalvando(novo);
    try {
      if (!configurado) {
        toast.info("Modo demo: status não é salvo. Conecte o Supabase.");
        return;
      }
      // Chama a Route Handler (que usa service_role para escrever)
      const resp = await fetch("/api/admin/pedido-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId, status: novo }),
      });
      if (!resp.ok) {
        const data = (await resp.json()) as { erro?: string };
        throw new Error(data.erro ?? `Erro ${resp.status}`);
      }
      toast.success(`Status alterado para: ${STATUS_INFO[novo].label}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao mudar status.");
    } finally {
      setSalvando(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-muted p-3 text-center">
        <p className="text-xs text-muted-foreground">Status atual</p>
        <Badge variant={STATUS_INFO[statusAtual].variant} className="mt-1">
          {STATUS_INFO[statusAtual].label}
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Mudar para:
        </p>
        {STATUS_ORDEM.map((status) => {
          const info = STATUS_INFO[status];
          const ativo = status === statusAtual;
          return (
            <Button
              key={status}
              type="button"
              variant={ativo ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              disabled={ativo || salvando !== null}
              onClick={() => mudarStatus(status)}
            >
              {salvando === status && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {info.label}
            </Button>
          );
        })}
      </div>

      <p className="flex items-start gap-1.5 pt-2 text-xs text-muted-foreground">
        <MessageCircle className="mt-0.5 h-3 w-3 shrink-0" />
        Ao confirmar/enviar, o cliente pode ser avisado via WhatsApp
        (configurado na Etapa 8).
      </p>
    </div>
  );
}
