import type { AuthState } from './types'

/**
 * Selectors kept apart from the store so components subscribe to one slice at a
 * time and re-render only when that slice changes.
 */
export const selectUser = (state: AuthState) => state.session?.user ?? null

export const selectIsRestoring = (state: AuthState) => state.status === 'restoring'

export const selectSignIn = (state: AuthState) => state.signIn

export const selectCompleteNewPassword = (state: AuthState) => state.completeNewPassword

export const selectAdopt = (state: AuthState) => state.adopt

export const selectSignOut = (state: AuthState) => state.signOut
