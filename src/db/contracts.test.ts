import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createInMemoryDb, type Db } from "./client";
import { resetDatabase } from "./test-utils";
import {
  realEstateAgencies,
  properties,
  rentalContracts,
  propertyAgencyHistory,
} from "./schema";

let db: Db;

beforeAll(async () => {
  ({ db } = await createInMemoryDb());
});

beforeEach(async () => {
  await resetDatabase(db);
});

async function criarImobiliariaEImovel() {
  const [ag] = await db
    .insert(realEstateAgencies)
    .values({ internalCode: "IMOB-001", name: "Imob A" })
    .returning();
  const [imovel] = await db
    .insert(properties)
    .values({
      internalCode: "IMV-001",
      name: "Sala da Contorno",
      currentAgencyId: ag.id,
    })
    .returning();
  return { ag, imovel };
}

describe("banco de dados — contratos e histórico de imobiliária", () => {
  it("cria um contrato com valor decimal preservado e padrões aplicados", async () => {
    const { ag, imovel } = await criarImobiliariaEImovel();
    const [c] = await db
      .insert(rentalContracts)
      .values({
        propertyId: imovel.id,
        agencyId: ag.id,
        startDate: "2026-01-01",
        contractValue: "2000.00",
        dueDay: 10,
        adminFeePercent: "8.00",
      })
      .returning();

    expect(c.contractValue).toBe("2000.00");
    expect(c.adminFeePercent).toBe("8.00");
    expect(c.weekendHolidayRule).toBe("proximo_dia_util");
    expect(c.status).toBe("ativo");
    expect(c.endDate).toBeNull();
  });

  it("rejeita dia de vencimento fora de 1..31 (CHECK)", async () => {
    const { ag, imovel } = await criarImobiliariaEImovel();
    await expect(
      db.insert(rentalContracts).values({
        propertyId: imovel.id,
        agencyId: ag.id,
        startDate: "2026-01-01",
        contractValue: "2000.00",
        dueDay: 32,
        adminFeePercent: "8.00",
      }),
    ).rejects.toThrow();
  });

  it("rejeita regra de fim de semana/feriado inválida (CHECK)", async () => {
    const { ag, imovel } = await criarImobiliariaEImovel();
    await expect(
      db.insert(rentalContracts).values({
        propertyId: imovel.id,
        agencyId: ag.id,
        startDate: "2026-01-01",
        contractValue: "2000.00",
        dueDay: 10,
        adminFeePercent: "8.00",
        weekendHolidayRule: "invalida",
      }),
    ).rejects.toThrow();
  });

  it("rejeita contrato apontando para imóvel inexistente (FK)", async () => {
    const { ag } = await criarImobiliariaEImovel();
    await expect(
      db.insert(rentalContracts).values({
        propertyId: "00000000-0000-0000-0000-000000000000",
        agencyId: ag.id,
        startDate: "2026-01-01",
        contractValue: "2000.00",
        dueDay: 10,
        adminFeePercent: "8.00",
      }),
    ).rejects.toThrow();
  });

  it("registra histórico de imobiliária com período em aberto (end_date nulo)", async () => {
    const { ag, imovel } = await criarImobiliariaEImovel();
    const [h] = await db
      .insert(propertyAgencyHistory)
      .values({
        propertyId: imovel.id,
        agencyId: ag.id,
        startDate: "2026-01-01",
      })
      .returning();

    expect(h.startDate).toBe("2026-01-01");
    expect(h.endDate).toBeNull();
  });
});
