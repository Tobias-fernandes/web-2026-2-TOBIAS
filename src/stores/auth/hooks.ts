import { useAuthStore } from './authStore'
import {
  selectIsAuthenticated,
  selectIsRestoring,
  selectSignIn,
  selectSignOut,
  selectStatus,
  selectUser,
} from './selectors'

export const useCurrentUser = () => useAuthStore(selectUser)

export const useAuthStatus = () => useAuthStore(selectStatus)

export const useIsRestoringSession = () => useAuthStore(selectIsRestoring)

export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated)

export const useSignIn = () => useAuthStore(selectSignIn)

export const useSignOut = () => useAuthStore(selectSignOut)
