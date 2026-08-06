"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { LOJA } from "@/lib/loja-config";
import { formatBRL } from "@/lib/money";

type Props = {
  pedido: {
    id: string;
    codigo: string;
    cliente_nome: string;
    cliente_telefone: string;
    total_cents: number;
    tipo_entrega: string;
  };
};

/**
 * Permite ao admin CONFIRMAR o recebimento do pedido e informar o prazo.
 * Gera uma mensagem de WhatsApp pronta para enviar ao cliente.
 *
 * Inclui verificação de horário de atendimento (08h-20h) — fora desse
 * horário, a mensagem avisa que a entrega será no próximo dia útil.
 */
export function NotificarCliente({ pedido }: Props) {
  const [prazoMinutos, setPrazoMinutos] = useState<string>("60");
  const [enviando, setEnviando] = useState(false);

  const agora = new Date();
  const hora = agora.getHours();
  const dentroHorario = hora >= 8 && hora < 20;
  // Verifica se é fim de semana (0=domingo, 6=sábado)
  const diaSemana = agora.getDay();
  const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;

  function montarMensagemConfirmacao(): string {
    const linhas: string[] = [];
    linhas.push(`Olá, ${pedido.cliente_nome}! 🌱`);
    linhas.push("");
    linhas.push(`✅ *Recebemos seu pedido ${pedido.codigo}*`);
    linhas.push(`💰 Total: ${formatBRL(pedido.total_cents)}`);
    linhas.push("");

    if (pedido.tipo_entrega === "retirada") {
      linhas.push("📦 Seu pedido já está sendo separado!");
      linhas.push(
        `🏪 Pode retirar em ${LOJA.nome} (${LOJA.unidades[0]?.endereco ?? ""}).`,
      );
    } else {
      const min = parseInt(prazoMinutos || "60", 10);
      if (min <= 90) {
        linhas.push(`🚚 *Tempo estimado de entrega: ${min} minutos*`);
      } else {
        const horas = Math.round(min / 60);
        linhas.push(`🚚 *Tempo estimado de entrega: ${horas} hora(s)*`);
      }
      linhas.push("📦 Já estamos separando seu pedido com carinho!");
    }

    linhas.push("");
    if (dentroHorario && !ehFimDeSemana) {
      linhas.push(`⏰ Estamos atendendo agora (horário: 08h às 20h).`);
    } else if (ehFimDeSemana) {
      linhas.push(
        `⚠️ No momento estamos fora do horário de atendimento.`,
      );
      linhas.push(
        `📅 Seu pedido será entregue no próximo dia útil, a partir das 08h.`,
      );
    } else {
      linhas.push(
        `⚠️ Registramos seu pedido fora do nosso horário (08h às 20h).`,
      );
      linhas.push(`📅 A entrega será feita amanhã a partir das 08h.`);
    }
    linhas.push("");
    linhas.push("Obrigado pela preferência! 💚");
    linhas.push(`_${LOJA.nome}_`);
    return linhas.join("\n");
  }

  function enviarConfirmacao() {
    setEnviando(true);
    const telefoneLimpo = pedido.cliente_telefone.replace(/\D/g, "");
    // Adiciona DDI 55 se não tiver
    const telefoneCompleto = telefoneLimpo.startsWith("55")
      ? telefoneLimpo
      : "55" + telefoneLimpo;
    const msg = montarMensagemConfirmacao();
    const url = `https://wa.me/${telefoneCompleto}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp com a mensagem de confirmação...");
    setTimeout(() => setEnviando(false), 1000);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-agro-blue/20 bg-agro-blue/5 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-agro-blue">
          <Clock className="h-3.5 w-3.5" />
          {dentroHorario && !ehFimDeSemana
            ? "🟢 Loja aberta agora (até 20h)"
            : "🔴 Fora do horário de atendimento"}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Horário de atendimento: <strong>segunda a sábado, 08h às 20h</strong>
        </p>
      </div>

      {/* Prazo de entrega */}
      <div className="space-y-1.5">
        <Label htmlFor="prazo" className="text-xs">
          ⏱️ Tempo estimado de entrega (em minutos)
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { val: "30", label: "30 min" },
            { val: "60", label: "1 hora" },
            { val: "120", label: "2 horas" },
            { val: "1440", label: "Amanhã" },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setPrazoMinutos(opt.val)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                prazoMinutos === opt.val
                  ? "border-agro-blue bg-agro-blue text-white"
                  : "hover:border-agro-blue"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          id="prazo"
          type="number"
          min="1"
          value={prazoMinutos}
          onChange={(e) => setPrazoMinutos(e.target.value)}
          className="mt-1 h-9 w-full rounded-md border px-3 text-sm"
          placeholder="60"
        />
      </div>

      {/* Preview da mensagem */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          📝 Ver mensagem que será enviada
        </summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-3 text-[11px] leading-relaxed">
          {montarMensagemConfirmacao()}
        </pre>
      </details>

      {/* Botão confirmar */}
      <Button
        type="button"
        variant="whatsapp"
        className="w-full"
        onClick={enviarConfirmacao}
        disabled={enviando}
      >
        {enviando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <WhatsAppIcon className="h-4 w-4" />
        )}
        Confirmar e avisar cliente
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        Abre o WhatsApp com a mensagem pronta. Você só precisa apertar enviar.
      </p>
    </div>
  );
}
