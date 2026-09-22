import type { ID, JuniorEnterprise } from "@/domain/types";
import { onlyDigits } from "@/lib/document";
import { DEMO_ENTERPRISE } from "./seed";
import { readGlobal, writeGlobal } from "./tenantStorage";

/**
 * The register of enterprises.
 *
 * Global rather than tenant-scoped, for the same reason the accounts are: it is
 * consulted before anyone is signed in — to refuse a CNPJ that already
 * registered, and to name the enterprise a session belongs to.
 *
 * The demo enterprise is always in it. It is not stored, it is prepended, so
 * that clearing the demo data cannot make the seeded tenant nameless.
 */
const COLLECTION = "enterprises";

export function listEnterprises(): JuniorEnterprise[] {
  return [DEMO_ENTERPRISE, ...readGlobal<JuniorEnterprise>(COLLECTION)];
}

export function findEnterprise(id: ID): JuniorEnterprise | null {
  return listEnterprises().find((enterprise) => enterprise.id === id) ?? null;
}

export function isCnpjRegistered(cnpj: string): boolean {
  const wanted = onlyDigits(cnpj);
  return listEnterprises().some((enterprise) => enterprise.cnpj === wanted);
}

export function saveEnterprise(enterprise: JuniorEnterprise): void {
  writeGlobal(COLLECTION, [
    enterprise,
    ...readGlobal<JuniorEnterprise>(COLLECTION),
  ]);
}
