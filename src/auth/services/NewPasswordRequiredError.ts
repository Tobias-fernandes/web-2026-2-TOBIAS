import { AuthError } from './AuthError'
import type { NewPasswordChallenge } from './types'

/**
 * Thrown by `signIn` instead of resolving, when Cognito requires a new
 * password before it will issue a session.
 *
 * Carries the challenge needed to finish the sign-in via
 * `AuthService.completeNewPassword` — the caller cannot treat this as an
 * ordinary failed attempt, since the credentials were correct.
 */
export class NewPasswordRequiredError extends AuthError {
  readonly challenge: NewPasswordChallenge

  constructor(challenge: NewPasswordChallenge) {
    super('Defina uma nova senha para continuar.')
    this.name = 'NewPasswordRequiredError'
    this.challenge = challenge
  }
}
