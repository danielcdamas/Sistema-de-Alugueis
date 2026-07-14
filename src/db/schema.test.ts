import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { createInMemoryDb, type Db } from "./client";
import { realEstateAgencies, properties } from "./schema";

// Um único banco embutido por arquivo (o custo de inicialização do PGlite é
// pago uma vez em beforeAll); cada teste começa com as tabelas vazias.
let db: Db;

beforeAll(async () => {
  ({ db } = await createInMemoryDb());
});

beforeEach(async () => {
  // Ordem respeita a FK: apaga imóveis antes de imobiliárias.
  await db.delete(properties);
  await db.delete(realEstateAgencies);
});

describe("banco de dados — cadastros (imobiliárias e imóveis)", () => {
  it("insere e lê uma imobiliária, com timestamps e sem arquivamento", async () => {
    const [ag] = await db
      .insert(realEstateAgencies)
      .values({
        internalCode: "IMOB-001",
        name: "Imobiliária Demonstração",
        additionalEmails: ["a@exemplo.com", "b@exemplo.com"],
      })
      .returning();

    expect(ag.id).toBeTruthy();
    expect(ag.name).toBe("Imobiliária Demonstração");
    expect(ag.additionalEmails).toEqual(["a@exemplo.com", "b@exemplo.com"]);
    expect(ag.createdAt).toBeInstanceOf(Date);
    expect(ag.archivedAt).toBeNull();
  });

  it("exige internal_code único na imobiliária", async () => {
    await db
      .insert(realEstateAgencies)
      .values({ internalCode: "IMOB-001", name: "A" });
    await expect(
      db
        .insert(realEstateAgencies)
        .values({ internalCode: "IMOB-001", name: "B" }),
    ).rejects.toThrow();
  });

  it("vincula um imóvel à sua imobiliária atual (FK)", async () => {
    const [ag] = await db
      .insert(realEstateAgencies)
      .values({ internalCode: "IMOB-001", name: "A" })
      .returning();
    const [imovel] = await db
      .insert(properties)
      .values({
        internalCode: "IMV-001",
        name: "Sala da Contorno",
        state: "MG",
        city: "Belo Horizonte",
        currentAgencyId: ag.id,
      })
      .returning();

    expect(imovel.currentAgencyId).toBe(ag.id);
    expect(imovel.name).toBe("Sala da Contorno");
  });

  it("rejeita imóvel apontando para imobiliária inexistente (FK)", async () => {
    await expect(
      db.insert(properties).values({
        internalCode: "IMV-002",
        name: "Imóvel órfão",
        currentAgencyId: "00000000-0000-0000-0000-000000000000",
      }),
    ).rejects.toThrow();
  });

  it("arquivamento lógico preenche archived_at sem apagar o registro", async () => {
    const [ag] = await db
      .insert(realEstateAgencies)
      .values({ internalCode: "IMOB-001", name: "A" })
      .returning();

    await db
      .update(realEstateAgencies)
      .set({ archivedAt: new Date() })
      .where(eq(realEstateAgencies.id, ag.id));

    const encontrados = await db
      .select()
      .from(realEstateAgencies)
      .where(eq(realEstateAgencies.id, ag.id));
    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].archivedAt).toBeInstanceOf(Date);
  });
});
