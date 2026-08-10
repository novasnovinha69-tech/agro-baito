import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Trocas e devoluções",
  description:
    "Política de trocas e devoluções. Prazos, condições e como solicitar.",
};

export default function TrocasDevolucoesPage() {
  const condicoes = [
    "O produto deve estar na embalagem original, sem uso e com nota fiscal.",
    "O prazo para troca ou devolução por arrependimento é de 7 dias corridos após o recebimento (CDC).",
    "Produtos perecíveis (rações abertas, medicamentos) não podem ser devolvidos após abertura.",
    "Em caso de produto com defeito, o prazo é de 30 dias para reclamação.",
    "O reembolso é feito no mesmo método de pagamento em até 7 dias úteis.",
  ];

  return (
    <div className="container-agro max-w-3xl py-8">
      <h1 className="font-display text-2xl font-bold text-agro-navy md:text-3xl">
        Trocas e devoluções
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sua satisfação é nossa prioridade. Conheça nossa política.
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="font-display text-lg font-bold">
            Condições para troca/devolução
          </h2>
          <ul className="mt-3 space-y-2">
            {condicoes.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-agro-emerald" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Como solicitar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre em contato pelo WhatsApp informando o número do pedido e o
            motivo da troca/devolução. Nossa equipe irá orientar os próximos
            passos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Reembolso</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            O reembolso é processado no mesmo método de pagamento original em
            até 7 dias úteis após o recebimento e conferência do produto
            devolvido. Para pagamentos via Pix, o reembolso é geralmente
            instantâneo.
          </p>
        </section>
      </div>
    </div>
  );
}
