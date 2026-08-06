import { notFound } from "next/navigation";
import { ProdutoForm } from "@/components/admin/produto-form";
import { adminListarCategorias, adminObterProdutoPorId } from "@/lib/admin-data";

export default async function EditarProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const [produto, categorias] = await Promise.all([
    adminObterProdutoPorId(params.id),
    adminListarCategorias(),
  ]);
  if (!produto) notFound();

  const { categoria, ...dadosForm } = produto;
  return <ProdutoForm produto={dadosForm} categorias={categorias} />;
}
