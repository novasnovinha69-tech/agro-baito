import { Shield } from "lucide-react";

export const metadata = {
  title: "Política de privacidade",
  description:
    "Como a Agro Baito coleta, usa e protege seus dados pessoais (LGPD).",
};

export default function PrivacidadePage() {
  return (
    <div className="container-agro max-w-3xl py-8">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-agro-blue/10">
          <Shield className="h-6 w-6 text-agro-blue" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-agro-navy">
            Política de privacidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Em conformidade com a LGPD (Lei nº 13.709/2018)
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-base font-bold text-foreground">
            1. Dados que coletamos
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Nome, telefone e e-mail (para contato e pedidos)</li>
            <li>CPF/CNPJ (para emissão de nota fiscal, quando fornecido)</li>
            <li>Endereço de entrega (para processar pedidos)</li>
            <li>Dados de navegação (cookies essenciais e analytics anônimos)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">
            2. Como usamos seus dados
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Processar e entregar seus pedidos</li>
            <li>Comunicar sobre o status do pedido (WhatsApp/e-mail)</li>
            <li>Cumprir obrigações fiscais (nota fiscal)</li>
            <li>Melhorar nossos produtos e serviços</li>
          </ul>
          <p className="mt-2">
            <strong>Nunca</strong> vendemos ou compartilhamos seus dados com
            terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">
            3. Seus direitos (LGPD)
          </h2>
          <p className="mt-2">
            Você pode solicitar a qualquer momento: confirmação da existência de
            tratamento, acesso aos dados, correção, anonimização, bloqueio,
            eliminação ou portabilidade dos dados. Para exercer seus direitos,
            entre em contato pelo WhatsApp da loja.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">
            4. Pagamentos (Mercado Pago)
          </h2>
          <p className="mt-2">
            Os dados de pagamento são processados diretamente pelo Mercado Pago,
            que é o responsável pela segurança dessas informações. A Agro Baito
            não armazena dados de cartão ou chaves Pix.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">
            5. Cookies
          </h2>
          <p className="mt-2">
            Usamos cookies essenciais para o funcionamento do site (carrinho de
            compras, sessão) e cookies analíticos anônimos para entender como o
            site é usado. Você pode desativar cookies nas configurações do seu
            navegador.
          </p>
        </section>

        <p className="border-t pt-4 text-xs">
          Esta política foi atualizada em agosto de 2026. Em caso de dúvidas,
          entre em contato pelo WhatsApp.
        </p>
      </div>
    </div>
  );
}
