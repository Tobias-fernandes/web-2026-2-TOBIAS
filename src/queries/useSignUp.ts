import { useMutation } from '@tanstack/react-query'
import { onboardingService, type SignUpInput } from '@/services'

/**
 * Registering a junior enterprise.
 *
 * Not invalidating anything on success, unlike every other mutation here: there
 * is no cache to refresh because nothing has been read yet — the session this
 * creates is the first one, and the screens load after it.
 */
export function useSignUp() {
  return useMutation({
    mutationFn: (input: SignUpInput) => onboardingService.signUp(input),
  })
}
