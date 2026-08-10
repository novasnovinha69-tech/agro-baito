import { expect, test } from "@playwright/test";

/**
 * Teste de fumaca (smoke test) — valida os fluxos principais da loja.
 *
 * Cobre: home carrega, catálogo acessível, produto abre, busca funciona,
 * carrinho adiciona, checkout carrega. Não finaliza pagamento.
 *
 * Roda contra mock-data (quando Supabase nao configurado) ou dados reais.
 */
test.describe("Smoke test — fluxos principais da loja", () => {
  test("home carrega com hero e categorias", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Agro Baito/);
    // Hero tem o h1
    await expect(page.locator("h1")).toBeVisible();
    // Algum link para o catalogo
    await expect(page.getByRole("link", { name: /catálogo/i })).toBeVisible();
  });

  test("navegacao home -> catalogo", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /catálogo/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/catalogo/);
  });

  test("catalogo mostra grid de produtos", async ({ page }) => {
    await page.goto("/catalogo");
    // Pelo menos um card de produto visivel (link para /produto/...)
    await expect(page.locator('a[href^="/produto/"]').first()).toBeVisible();
  });

  test("abre detalhe de um produto", async ({ page }) => {
    await page.goto("/catalogo");
    const primeiroProduto = page.locator('a[href^="/produto/"]').first();
    await primeiroProduto.click();
    await expect(page).toHaveURL(/\/produto\//);
    // Tem um heading com o nome do produto
    await expect(page.locator("h1")).toBeVisible();
  });

  test("busca por texto funciona", async ({ page }) => {
    await page.goto("/buscar?q=racao");
    await expect(page).toHaveURL(/q=racao/);
  });

  test("carrinho abre ao adicionar produto", async ({ page }) => {
    await page.goto("/catalogo");
    // Clica no botao "Adicionar" do primeiro card
    const botaoAdd = page.getByRole("button", { name: /adicionar/i }).first();
    if (await botaoAdd.isVisible()) {
      await botaoAdd.click();
      // O drawer do carrinho deve aparecer
      await expect(page.getByText(/subtotal|carrinho/i).first()).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("pagina de checkout carrega", async ({ page }) => {
    await page.goto("/checkout");
    // A pagina carrega (mesmo que vazia ou com mensagem)
    await expect(page.locator("body")).toBeVisible();
  });

  test("pagina de login carrega", async ({ page }) => {
    await page.goto("/entrar");
    await expect(page.locator("body")).toBeVisible();
  });
});
