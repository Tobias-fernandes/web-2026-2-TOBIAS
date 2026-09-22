import type { Session } from '@/domain/types'
import type { Credentials, NewPasswordChallenge } from '@/auth/services'

/** `restoring` covers the first paint, before the persisted session is read. */
export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous'

export interface AuthState {
  session: Session | null
  status: AuthStatus
  signIn: (credentials: Credentials) => Promise<void>
  completeNewPassword: (
    challenge: NewPasswordChallenge,
    newPassword: string,
  ) => Promise<void>
  /**
   * Authenticates with a `Session` the caller already holds, rather than
   * asking `authService` to go find one.
   *
   * For sign-up: `OnboardingService.signUp` hands back the session it just
   * created and persisted itself — asking `authService.restore()` to
   * re-derive it would route through whichever service `VITE_AUTH_SOURCE`
   * currently points at, which is not necessarily the one sign-up used, and
   * would silently fail to find it.
   */
  adopt: (session: Session) => void
  signOut: () => Promise<void>
  restore: () => Promise<void>
}
