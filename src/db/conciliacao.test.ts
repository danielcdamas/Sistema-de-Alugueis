import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createInMemoryDb, type Db } from "./client";
import { resetDatabase } from "./test-utils";
import {
  realEstateAgencies,
  properties,
  rentalContracts,
  statementComponents,
  bankMovements,
} from "./schema";
import { ensureMonthlyPeriod } from "./periods";
import { avaliarCompetenciaPersistida } from "./conciliacao";
import { reaisParaCentavos } from "../lib/financeiro";

let db: Db;

beforeAll(async () => {
  ({ db } = await createInMemoryDb());
});

beforeEach(async () => {
  await resetDatabase(db);
});

async function criarCompetencia() {
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
  const { period } = await ensureMonthlyPeriod(db, contract, 2026, 6);
  return { ag, imovel, contract, period };
}

async function inserirDemonstrativoPadrao(periodId: string) {
  await db.insert(statementComponents).values([
    { monthlyRentPeriodId: periodId, kind: "bruto_devido", value: "2000.00" },
    { monthlyRentPeriodId: periodId, kind: "taxa_admin", value: "160.00" },
    { monthlyRentPeriodId: periodId, kind: "taxa_bancaria", value: "5.00" },
    {
      monthlyRentPeriodId: periodId,
      kind: "ressarcimento_iptu",
      value: "150.00",
    },
  ]);
}

describe("conciliação sobre dados persistidos", () => {
  it("avalia a competência a partir do demonstrativo e do depósito gravados (conciliado)", async () => {
    const { period } = await criarCompetencia();
    await inserirDemonstrativoPadrao(period.id);
    await db.insert(bankMovements).values({
      monthlyRentPeriodId: period.id,
      tipo: "deposito",
      value: "1985.00",
    });

    const r = await avaliarCompetenciaPersistida(db, period.id);
    expect(r.liquidoTributavel).toBe(reaisParaCentavos("1835.00"));
    expect(r.esperadoParaDeposito).toBe(reaisParaCentavos("1985.00"));
    expect(r.totalDepositado).toBe(reaisParaCentavos("1985.00"));
    expect(r.divergencia).toBe(0);
    expect(r.situacao).toBe("conciliado");
  });

  it("reflete estorno gravado (recebido a menor)", async () => {
    const { period } = await criarCompetencia();
    await inserirDemonstrativoPadrao(period.id);
    await db.insert(bankMovements).values([
      {
        monthlyRentPeriodId: period.id,
        tipo: "deposito",
        value: "1985.00",
      },
      { monthlyRentPeriodId: period.id, tipo: "estorno", value: "200.00" },
    ]);

    const r = await avaliarCompetenciaPersistida(db, period.id);
    expect(r.totalDepositado).toBe(reaisParaCentavos("1785.00"));
    expect(r.divergencia).toBe(reaisParaCentavos("-200.00"));
    expect(r.situacao).toBe("recebido_a_menor");
  });

  it("rejeita tipo de movimento inválido (CHECK)", async () => {
    const { period } = await criarCompetencia();
    await expect(
      db.insert(bankMovements).values({
        monthlyRentPeriodId: period.id,
        tipo: "invalido",
        value: "100.00",
      }),
    ).rejects.toThrow();
  });

  it("rejeita kind de componente inválido (CHECK)", async () => {
    const { period } = await criarCompetencia();
    await expect(
      db.insert(statementComponents).values({
        monthlyRentPeriodId: period.id,
        kind: "invalido",
        value: "100.00",
      }),
    ).rejects.toThrow();
  });

  it("rejeita depósito com valor negativo (CHECK)", async () => {
    const { period } = await criarCompetencia();
    await expect(
      db.insert(bankMovements).values({
        monthlyRentPeriodId: period.id,
        tipo: "deposito",
        value: "-10.00",
      }),
    ).rejects.toThrow();
  });

  it("aceita compensação com valor negativo", async () => {
    const { period } = await criarCompetencia();
    const [m] = await db
      .insert(bankMovements)
      .values({
        monthlyRentPeriodId: period.id,
        tipo: "compensacao",
        value: "-10.00",
      })
      .returning();
    expect(m.value).toBe("-10.00");
  });
});
