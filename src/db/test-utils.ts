import type { Db } from "./client";
import {
  bankMovements,
  statementComponents,
  monthlyRentPeriods,
  propertyAgencyHistory,
  rentalContracts,
  properties,
  realEstateAgencies,
} from "./schema";

/** Limpa todas as tabelas na ordem segura para as chaves estrangeiras. */
export async function resetDatabase(db: Db) {
  await db.delete(bankMovements);
  await db.delete(statementComponents);
  await db.delete(monthlyRentPeriods);
  await db.delete(propertyAgencyHistory);
  await db.delete(rentalContracts);
  await db.delete(properties);
  await db.delete(realEstateAgencies);
}
