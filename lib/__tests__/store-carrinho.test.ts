import { beforeEach, describe, expect, it } from "vitest";
import type { Produto } from "@/types/database.types";
import { useCarrinho } from "../store/carrinho";

// Fabrica de produto
function produto(partial: Partial<Produto> = {}): Produto {
  return {
    id: "p1",
    nome: "Racao Teste",
    slug: "racao-teste",
    descricao: null,
    foto_url: null,
    categoria_id: "c1",
    preco_cents: 10000,
    preco_promocional_cents: null,
    preco_por_kg: false,
    peso_kg: null,
    unidade_medida: "un",
    qtd_minima: 1,
    multiplo: 1,
    estoque: 50,
    estoque_minimo: 5,
    destaque: false,
    created_at: "",
    ...partial,
  } as Produto;
}

// Reset do store antes de cada teste (Zustand persiste em localStorage)
beforeEach(() => {
  useCarrinho.setState({ itens: [], aberto: false });
  localStorage.clear();
});

describe("store/carrinho — adicionar", () => {
  it("adiciona um novo item ao carrinho", () => {
    useCarrinho.getState().adicionar(produto());
    const estado = useCarrinho.getState();
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0].produtoId).toBe("p1");
    expect(estado.itens[0].quantidade).toBe(1);
  });

  it("abre o drawer ao adicionar", () => {
    useCarrinho.getState().adicionar(produto());
    expect(useCarrinho.getState().aberto).toBe(true);
  });

  it("incrementa quantidade quando item ja existe", () => {
    useCarrinho.getState().adicionar(produto());
    useCarrinho.getState().adicionar(produto());
    const estado = useCarrinho.getState();
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0].quantidade).toBe(2);
  });

  it("respeita qtd_minima ao adicionar", () => {
    const p = produto({ id: "p2", qtd_minima: 3 });
    useCarrinho.getState().adicionar(p);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(3);
  });

  it("arredonda para o multiplo correto", () => {
    const p = produto({ id: "p3", multiplo: 6 });
    useCarrinho.getState().adicionar(p, 7); // pediu 7, multiplo 6 -> 12
    expect(useCarrinho.getState().itens[0].quantidade).toBe(12);
  });

  it("limite de estoque ao adicionar", () => {
    const p = produto({ id: "p4", estoque: 5 });
    useCarrinho.getState().adicionar(p, 100);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(5);
  });

  it("usa preco promocional quando aplicavel", () => {
    const p = produto({
      id: "p5",
      preco_cents: 10000,
      preco_promocional_cents: 8000,
    });
    useCarrinho.getState().adicionar(p);
    expect(useCarrinho.getState().itens[0].precoCents).toBe(8000);
    expect(useCarrinho.getState().itens[0].precoOriginalCents).toBe(10000);
  });
});

describe("store/carrinho — atualizarQuantidade", () => {
  it("atualiza a quantidade de um item", () => {
    useCarrinho.getState().adicionar(produto({ id: "a" }));
    useCarrinho.getState().atualizarQuantidade("a", 5);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(5);
  });

  it("nao permite quantidade acima do estoque", () => {
    const p = produto({ id: "b", estoque: 10 });
    useCarrinho.getState().adicionar(p);
    useCarrinho.getState().atualizarQuantidade("b", 999);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(10);
  });

  it("nao permite quantidade abaixo de 1", () => {
    useCarrinho.getState().adicionar(produto({ id: "c" }));
    useCarrinho.getState().atualizarQuantidade("c", 0);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(1);
  });

  it("respeita multiplo ao atualizar", () => {
    const p = produto({ id: "d", multiplo: 5 });
    useCarrinho.getState().adicionar(p);
    useCarrinho.getState().atualizarQuantidade("d", 7); // multiplo 5 -> 10
    expect(useCarrinho.getState().itens[0].quantidade).toBe(10);
  });
});

describe("store/carrinho — remover e limpar", () => {
  it("remove um item especifico", () => {
    useCarrinho.getState().adicionar(produto({ id: "x" }));
    useCarrinho.getState().adicionar(produto({ id: "y" }));
    useCarrinho.getState().remover("x");
    const estado = useCarrinho.getState();
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0].produtoId).toBe("y");
  });

  it("limpa todos os itens", () => {
    useCarrinho.getState().adicionar(produto({ id: "x" }));
    useCarrinho.getState().adicionar(produto({ id: "y" }));
    useCarrinho.getState().limpar();
    expect(useCarrinho.getState().itens).toHaveLength(0);
  });
});

describe("store/carrinho — derivados (subtotal / totalItens)", () => {
  it("totalItens soma todas as quantidades", () => {
    useCarrinho.getState().adicionar(produto({ id: "a" }), 2);
    useCarrinho.getState().adicionar(produto({ id: "b" }), 3);
    expect(useCarrinho.getState().totalItens()).toBe(5);
  });

  it("subtotalCents soma preco x quantidade de cada item", () => {
    useCarrinho
      .getState()
      .adicionar(produto({ id: "a", preco_cents: 1000 }), 2); // R$10 x 2 = R$20
    useCarrinho
      .getState()
      .adicionar(produto({ id: "b", preco_cents: 5000 }), 1); // R$50 x 1 = R$50
    expect(useCarrinho.getState().subtotalCents()).toBe(7000); // R$70
  });
});

describe("store/carrinho — sincronizarEstoque", () => {
  it("ajusta quantidade quando estoque diminui", () => {
    const p = produto({ id: "s1", estoque: 10 });
    useCarrinho.getState().adicionar(p, 5);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(5);

    useCarrinho.getState().sincronizarEstoque([{ id: "s1", estoque: 3 }]);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(3);
    expect(useCarrinho.getState().itens[0].estoque).toBe(3);
  });

  it("remove item quando estoque zera (quantidade 0)", () => {
    const p = produto({ id: "s2", estoque: 10 });
    useCarrinho.getState().adicionar(p, 5);
    useCarrinho.getState().sincronizarEstoque([{ id: "s2", estoque: 0 }]);
    expect(useCarrinho.getState().itens).toHaveLength(0);
  });

  it("nao altera itens sem correspondencia no estoque novo", () => {
    const p = produto({ id: "s3", estoque: 10 });
    useCarrinho.getState().adicionar(p, 5);
    useCarrinho
      .getState()
      .sincronizarEstoque([{ id: "outro-produto", estoque: 1 }]);
    expect(useCarrinho.getState().itens).toHaveLength(1);
    expect(useCarrinho.getState().itens[0].quantidade).toBe(5);
  });
});

describe("store/carrinho — drawer (abrir/fechar/alternar)", () => {
  it("abrir/fechar/alternar mudam o estado aberto", () => {
    useCarrinho.getState().abrir();
    expect(useCarrinho.getState().aberto).toBe(true);
    useCarrinho.getState().fechar();
    expect(useCarrinho.getState().aberto).toBe(false);
    useCarrinho.getState().alternar();
    expect(useCarrinho.getState().aberto).toBe(true);
  });
});
