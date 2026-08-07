import { notFound } from "next/navigation";
import { obterProdutoPorSlug } from "@/lib/data";
import { ProdutoDetalhe } from "@/components/loja/produto-detalhe";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const produto = await obterProdutoPorSlug(params.slug);
  if (!produto) return { title: "Produto não encontrado" };
  return {
    title: produto.nome,
    description:
      produto.descricao ??
      `${produto.nome} na Agro Baito. Entrega em Porto Belo.`,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: { slug: string };
}) {
  const produto = await obterProdutoPorSlug(params.slug);
  if (!produto) notFound();

  return <ProdutoDetalhe produto={produto} />;
}
