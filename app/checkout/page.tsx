import { CheckoutCliente } from "@/components/loja/checkout-cliente";
import { listarUnidadesComZonas } from "@/lib/data";

export const metadata = { title: "Finalizar compra" };

export default async function CheckoutPage() {
  const unidades = await listarUnidadesComZonas();
  return <CheckoutCliente unidades={unidades} />;
}
