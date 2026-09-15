import type { Session, User } from '@/domain/types'
import type { Credentials } from '@/auth/services'

/** `restoring` covers the first paint, before the persisted session is read. */
export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous'

export interface AuthState {
  session: Session | null
  status: AuthStatus
  signIn: (credentials: Credentials) => Promise<void>
  signOut: () => Promise<void>
  restore: () => Promise<void>
}

export interface AuthSelectors {
  user: User | null
  isAuthenticated: boolean
}
