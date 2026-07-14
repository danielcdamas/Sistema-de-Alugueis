import { defineConfig } from "vitest/config";

// Testes unitários (funções puras: financeiro, formatação, validação).
// Os testes ponta a ponta ficam em ./e2e e rodam pelo Playwright, não aqui.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
  },
});
