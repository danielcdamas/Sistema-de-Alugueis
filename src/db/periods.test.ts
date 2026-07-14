import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { createInMemoryDb, type Db } from "./client";
import { resetDatabase } from "./test-utils";
import {
  realEstateAgencies,
  properties,
  rentalContracts,
  monthlyRentPeriods,
} from "./schema";
import { ensureMonthlyPeriod } from "./periods";

let db: Db;

beforeAll(async () => {
  ({ db } = await createInMemoryDb());
});

beforeEach(async () => {
  await resetDatabase(db);
});

async function criarContrato() {
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
  const [contract] = await db
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
  return { ag, imovel, contract };
}

describe("banco de dados — competências (geração idempotente e fotografia)", () => {
  it("gera a competência com a fotografia das regras do contrato", async () => {
    const { contract } = await criarContrato();
    const { created, period } = await ensureMonthlyPeriod(
      db,
      contract,
      2026,
      6,
    );

    expect(created).toBe(true);
    expect(period.competenciaAno).toBe(2026);
    expect(period.competenciaMes).toBe(6);
    expect(period.expectedGrossRent).toBe("2000.00");
    expect(period.adminFeePercent).toBe("8.00");
    expect(period.dueDay).toBe(10);
    expect(period.status).toBe("previsto");
    expect(period.origin).toBe("automatica");
  });

  it("é idempotente: gerar duas vezes o mesmo mês não duplica", async () => {
    const { contract } = await criarContrato();
    const primeira = await ensureMonthlyPeriod(db, contract, 2026, 6);
    const segunda = await ensureMonthlyPeriod(db, contract, 2026, 6);

    expect(primeira.created).toBe(true);
    expect(segunda.created).toBe(false);

    const todas = await db.select().from(monthlyRentPeriods);
    expect(todas).toHaveLength(1);
  });

  it("a fotografia vale por competência (alterar o contrato afeta só as novas)", async () => {
    const { contract } = await criarContrato();
    await ensureMonthlyPeriod(db, contract, 2026, 6); // junho: taxa 8,00

    await db
      .update(rentalContracts)
      .set({ adminFeePercent: "10.00" })
      .where(eq(rentalContracts.id, contract.id));
    const [contratoNovo] = await db
      .select()
      .from(rentalContracts)
      .where(eq(rentalContracts.id, contract.id));
    await ensureMonthlyPeriod(db, contratoNovo, 2026, 7); // julho: taxa 10,00

    const periodos = await db.select().from(monthlyRentPeriods);
    const junho = periodos.find((p) => p.competenciaMes === 6);
    const julho = periodos.find((p) => p.competenciaMes === 7);
    expect(junho?.adminFeePercent).toBe("8.00");
    expect(julho?.adminFeePercent).toBe("10.00");
  });

  it("rejeita competência duplicada por inserção direta (UNIQUE)", async () => {
    const { contract } = await criarContrato();
    await ensureMonthlyPeriod(db, contract, 2026, 6);
    await expect(
      db.insert(monthlyRentPeriods).values({
        propertyId: contract.propertyId,
        competenciaAno: 2026,
        competenciaMes: 6,
      }),
    ).rejects.toThrow();
  });

  it("rejeita mês de competência fora de 1..12 (CHECK)", async () => {
    const { contract } = await criarContrato();
    await expect(
      db.insert(monthlyRentPeriods).values({
        propertyId: contract.propertyId,
        competenciaAno: 2026,
        competenciaMes: 13,
      }),
    ).rejects.toThrow();
  });
});
