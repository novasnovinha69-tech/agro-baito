import { ProdutoForm } from "@/components/admin/produto-form";
import { adminListarCategorias } from "@/lib/admin-data";

export default async function NovoProdutoPage() {
  const categorias = await adminListarCategorias();
  return <ProdutoForm produto={null} categorias={categorias} />;
}
