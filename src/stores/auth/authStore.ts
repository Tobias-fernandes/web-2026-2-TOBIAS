import { create } from 'zustand'
import { authService } from '@/auth/services'
import { writeActiveEnterpriseId } from '@/config/storage'
import type { AuthState } from './types'

/**
 * Global authentication state.
 *
 * Kept in Zustand rather than a React context so that non-React code can read it
 * too — the HTTP client pulls the bearer token straight from
 * `useAuthStore.getState()` without any provider wiring.
 *
 * Also the one place that keeps the tenant-scoped mock storage pointed at the
 * right enterprise (`writeActiveEnterpriseId`), written in the same breath as
 * `session` itself. Every sign-in, password change, sign-out and restore
 * passes through here uniformly regardless of which `AuthService` is
 * active — mock or Cognito — so this is the one place that can keep the two
 * in sync, rather than each implementation remembering to.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  status: 'restoring',

  async signIn(credentials) {
    const session = await authService.signIn(credentials)
    writeActiveEnterpriseId(session.user.enterpriseId)
    set({ session, status: 'authenticated' })
  },

  async completeNewPassword(challenge, newPassword) {
    const session = await authService.completeNewPassword(challenge, newPassword)
    writeActiveEnterpriseId(session.user.enterpriseId)
    set({ session, status: 'authenticated' })
  },

  adopt(session) {
    writeActiveEnterpriseId(session.user.enterpriseId)
    set({ session, status: 'authenticated' })
  },

  async signOut() {
    await authService.signOut()
    writeActiveEnterpriseId(null)
    set({ session: null, status: 'anonymous' })
  },

  async restore() {
    try {
      const session = await authService.restore()
      writeActiveEnterpriseId(session?.user.enterpriseId ?? null)
      set({ session, status: session ? 'authenticated' : 'anonymous' })
    } catch {
      // A restore that throws must still resolve the status, or `RequireAuth`
      // waits on 'restoring' forever and the app never leaves the spinner.
      writeActiveEnterpriseId(null)
      set({ session: null, status: 'anonymous' })
    }
  },
}))
