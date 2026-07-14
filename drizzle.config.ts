import { defineConfig } from "drizzle-kit";

// Configuração do Drizzle Kit para gerar migrações SQL a partir do schema.
// A geração não precisa de banco ativo. As migrações são aplicadas ao PGlite
// (embutido) nos testes e, em produção, a um PostgreSQL gerenciado.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
});
