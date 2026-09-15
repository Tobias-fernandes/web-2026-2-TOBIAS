import { create } from 'zustand'
import { authService } from '@/auth/services'
import type { AuthState } from './types'

/**
 * Global authentication state.
 *
 * Kept in Zustand rather than a React context so that non-React code can read it
 * too — the HTTP client pulls the bearer token straight from
 * `useAuthStore.getState()` without any provider wiring.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  status: 'restoring',

  async signIn(credentials) {
    const session = await authService.signIn(credentials)
    set({ session, status: 'authenticated' })
  },

  async signOut() {
    await authService.signOut()
    set({ session: null, status: 'anonymous' })
  },

  async restore() {
    const session = await authService.restore()
    set({ session, status: session ? 'authenticated' : 'anonymous' })
  },
}))
