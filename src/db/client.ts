import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";

/**
 * Cria um banco PostgreSQL embutido (PGlite), em memória, aplica as migrações
 * e devolve um cliente Drizzle pronto para uso.
 *
 * Roda inteiramente em processo (sem servidor nem instalação), por isso serve
 * para testes e desenvolvimento local tanto aqui quanto no CI. O schema é
 * PostgreSQL padrão, então o mesmo modelo vale para um Postgres gerenciado em
 * produção.
 */
export async function createInMemoryDb() {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: "drizzle" });
  return { db, client };
}

export type Db = Awaited<ReturnType<typeof createInMemoryDb>>["db"];
