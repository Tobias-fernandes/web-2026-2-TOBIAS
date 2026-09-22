import type { ID } from '@/domain/types'
import { readGlobal, writeGlobal } from './tenantStorage'

/**
 * Sign-in credentials for enterprises registered through the demo.
 *
 * Global, not tenant-scoped: it is read to decide *which* tenant somebody
 * belongs to, so it cannot itself live inside one. This is the demo's stand-in
 * for the Cognito user pool — the password sits here in the clear, which is
 * exactly why this module dies the day the pool exists.
 */
export interface DemoAccount {
  id: ID
  enterpriseId: ID
  memberId: ID
  name: string
  email: string
  password: string
}

const COLLECTION = 'accounts'

export const listAccounts = (): DemoAccount[] => readGlobal<DemoAccount>(COLLECTION)

export function findAccount(email: string): DemoAccount | null {
  const wanted = email.trim().toLowerCase()
  return listAccounts().find((account) => account.email.toLowerCase() === wanted) ?? null
}

export function saveAccount(account: DemoAccount): void {
  writeGlobal(COLLECTION, [account, ...listAccounts()])
}
