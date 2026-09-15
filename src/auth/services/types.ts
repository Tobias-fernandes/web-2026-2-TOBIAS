import type { Session } from '@/domain/types'

export interface Credentials {
  email: string
  password: string
}

/**
 * Authentication contract.
 *
 * Implemented today by `mockAuthService` (demo users) and, once the User Pool
 * exists, by `cognitoAuthService`. The auth store only knows this interface.
 */
export interface AuthService {
  signIn(credentials: Credentials): Promise<Session>
  signOut(): Promise<void>
  /** Persisted session, if still valid. Called once on app start-up. */
  restore(): Promise<Session | null>
}
