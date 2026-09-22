import { DEMO_ENTERPRISE_ID, DEMO_STORAGE_PREFIX, readActiveEnterpriseId } from '@/config/storage'
import type { ID } from '@/domain/types'

/**
 * Tenant-scoped storage for the demo.
 *
 * Every collection lives under the enterprise it belongs to, so one EJ's
 * records are not merely filtered out of another's view — they are in a
 * different place entirely, and a bug in a filter cannot leak them. This is the
 * demo's stand-in for what the API does with the tenant in the caller's token.
 *
 * The active enterprise is read from storage on each call rather than held in
 * a variable: the repositories are created when their module loads, which
 * happens before any session is restored, and a captured value would belong
 * to whoever was signed in first.
 */

export function activeEnterpriseId(): ID {
  return readActiveEnterpriseId() ?? DEMO_ENTERPRISE_ID
}

const scopedKey = (enterpriseId: ID, collection: string) =>
  `${DEMO_STORAGE_PREFIX}${enterpriseId}:${collection}`

function readCollection<T>(collection: string, enterpriseId?: ID): T[] | null {
  try {
    const raw = localStorage.getItem(
      scopedKey(enterpriseId ?? activeEnterpriseId(), collection),
    )
    return raw ? (JSON.parse(raw) as T[]) : null
  } catch {
    return null
  }
}

/**
 * A collection, falling back to its seed the same way every repository does.
 *
 * Only the demo enterprise has a seed to fall back to — a real one that has
 * nothing stored is simply empty. Pulled out of `createMockRepository` so
 * anything else reading storage directly, like resolving a signed-in member's
 * cargo, sees the same demo data the rest of the app does instead of an empty
 * collection the first time nobody has written to it yet.
 */
export function readCollectionOrSeed<T>(
  collection: string,
  seed: T[],
  enterpriseId?: ID,
): T[] {
  const id = enterpriseId ?? activeEnterpriseId()
  const stored = readCollection<T>(collection, id)
  if (stored) return stored
  if (id !== DEMO_ENTERPRISE_ID) return []
  return isMarkedEmpty(id) ? [] : seed
}

export function writeCollection<T>(
  collection: string,
  records: T[],
  enterpriseId?: ID,
): void {
  try {
    localStorage.setItem(
      scopedKey(enterpriseId ?? activeEnterpriseId(), collection),
      JSON.stringify(records),
    )
  } catch {
    // No persistence available; records live for this session only.
  }
}

/**
 * Marks an enterprise's data as deliberately emptied.
 *
 * Scoped like everything else: emptying the demo to walk the system from day
 * zero must not empty the EJ that registered in the next tab, and clearing a
 * real enterprise must not resurrect the demo's seed inside it.
 */
const emptyFlagKey = (enterpriseId: ID) =>
  `${DEMO_STORAGE_PREFIX}${enterpriseId}:__vazio`

export function isMarkedEmpty(enterpriseId?: ID): boolean {
  try {
    return Boolean(localStorage.getItem(emptyFlagKey(enterpriseId ?? activeEnterpriseId())))
  } catch {
    return false
  }
}

export function markEmpty(enterpriseId?: ID): void {
  try {
    localStorage.setItem(emptyFlagKey(enterpriseId ?? activeEnterpriseId()), '1')
  } catch {
    // Nothing was persisted to mark; the next load reads the seed either way.
  }
}

/** Drops every collection of one enterprise, the empty mark included. */
export function clearTenant(enterpriseId?: ID): void {
  const scope = `${DEMO_STORAGE_PREFIX}${enterpriseId ?? activeEnterpriseId()}:`
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(scope)) localStorage.removeItem(key)
    }
  } catch {
    // Private browsing or blocked storage: there was nothing stored to drop.
  }
}

/**
 * Collections that belong to no enterprise: the register of enterprises itself
 * and the sign-in credentials, both of which are consulted before anyone is
 * signed in and therefore before a tenant is known.
 */
const globalKey = (collection: string) => `${DEMO_STORAGE_PREFIX}${collection}`

export function readGlobal<T>(collection: string): T[] {
  try {
    const raw = localStorage.getItem(globalKey(collection))
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function writeGlobal<T>(collection: string, records: T[]): void {
  try {
    localStorage.setItem(globalKey(collection), JSON.stringify(records))
  } catch {
    // No persistence available.
  }
}
