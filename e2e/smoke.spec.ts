import { test, expect } from "@playwright/test";

test("a página inicial carrega e mostra o título do sistema", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Controle de Aluguéis" }),
  ).toBeVisible();
});
