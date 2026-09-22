import { useAuthStore } from './authStore'
import {
  selectAdopt,
  selectCompleteNewPassword,
  selectIsRestoring,
  selectSignIn,
  selectSignOut,
  selectUser,
} from './selectors'

export const useCurrentUser = () => useAuthStore(selectUser)

export const useIsRestoringSession = () => useAuthStore(selectIsRestoring)

export const useSignIn = () => useAuthStore(selectSignIn)

export const useCompleteNewPassword = () => useAuthStore(selectCompleteNewPassword)

export const useAdoptSession = () => useAuthStore(selectAdopt)

export const useSignOut = () => useAuthStore(selectSignOut)
