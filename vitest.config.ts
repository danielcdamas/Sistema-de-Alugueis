import { defineConfig } from "vitest/config";

// Testes unitários (funções puras: financeiro, formatação, validação).
// Os testes ponta a ponta ficam em ./e2e e rodam pelo Playwright, não aqui.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
    // O PGlite (Postgres embutido) tem custo de inicialização (compilação WASM)
    // na primeira vez; damos folga aos tempos-limite dos testes de banco.
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
