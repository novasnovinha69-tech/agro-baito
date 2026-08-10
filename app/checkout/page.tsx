import dynamic from "next/dynamic";
import { listarUnidadesComZonas } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Finalizar compra" };

/**
 * CheckoutCliente e um client component pesado (~800 linhas: Mercado Pago,
 * ViaCEP, validacao). Carregamos via next/dynamic para separar esse JS do
 * bundle inicial da rota — so e baixado quando o usuario chega no checkout.
 * SSR mantido para SEO/primeira pintura.
 *
 * Motion principle (Emil - performance): lazy load de codigo nao critico.
 */
const CheckoutCliente = dynamic(
  () =>
    import("@/components/loja/checkout-cliente").then(
      (m) => m.CheckoutCliente,
    ),
  {
    ssr: true,
    loading: () => <CheckoutFallback />,
  },
);

function CheckoutFallback() {
  return (
    <div className="container-agro py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default async function CheckoutPage() {
  const unidades = await listarUnidadesComZonas();
  return <CheckoutCliente unidades={unidades} />;
}
