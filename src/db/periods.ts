import { and, eq, type InferSelectModel } from "drizzle-orm";
import type { Db } from "./client";
import { monthlyRentPeriods, rentalContracts } from "./schema";

type Contract = InferSelectModel<typeof rentalContracts>;

/**
 * Garante — de forma idempotente — a existência da competência de um imóvel em
 * um dado ano/mês, a partir do contrato informado. Se já existir, não duplica
 * nem sobrescreve (a unicidade por imóvel + ano + mês é aplicada no banco).
 *
 * A competência guarda uma FOTOGRAFIA das regras do contrato no momento da
 * geração; alterações posteriores no contrato não afetam competências já
 * criadas.
 *
 * Retorna se a competência foi criada agora e a linha correspondente.
 */
export async function ensureMonthlyPeriod(
  db: Db,
  contract: Contract,
  ano: number,
  mes: number,
) {
  const inseridos = await db
    .insert(monthlyRentPeriods)
    .values({
      propertyId: contract.propertyId,
      contractId: contract.id,
      agencyId: contract.agencyId,
      competenciaAno: ano,
      competenciaMes: mes,
      expectedGrossRent: contract.contractValue,
      adminFeePercent: contract.adminFeePercent,
      dueDay: contract.dueDay,
      weekendHolidayRule: contract.weekendHolidayRule,
      origin: "automatica",
    })
    .onConflictDoNothing()
    .returning();

  if (inseridos.length > 0) {
    return { created: true, period: inseridos[0] };
  }

  const [existente] = await db
    .select()
    .from(monthlyRentPeriods)
    .where(
      and(
        eq(monthlyRentPeriods.propertyId, contract.propertyId),
        eq(monthlyRentPeriods.competenciaAno, ano),
        eq(monthlyRentPeriods.competenciaMes, mes),
      ),
    );
  return { created: false, period: existente };
}
