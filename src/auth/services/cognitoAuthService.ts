import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js'
import { env } from '@/config/env'
import type { Session, User } from '@/domain/types'
import { resolveSessionProfileByEmail } from '@/services/mock/sessionProfile'
import { AuthError } from './AuthError'
import { cognitoStorage } from './cognitoStorage'
import { NewPasswordRequiredError } from './NewPasswordRequiredError'
import type { AuthService, Credentials, NewPasswordChallenge } from './types'

/**
 * Authentication through Amazon Cognito — SRP, straight from the browser.
 *
 * The password never leaves this tab as plaintext: `authenticateUser` runs the
 * Secure Remote Password protocol, a zero-knowledge proof, against Cognito's
 * public API directly. No backend sits in this path and none is needed — the
 * app client has no secret to protect, which is what a public SPA client is
 * for. What the backend *is* needed for is anything that writes the tenant
 * claim (`custom:ejId`): sign-up and invitations, both elsewhere.
 *
 * Cargo and diretoria are not read from the token — Cognito only knows `sub`,
 * `email` and `custom:ejId`; a position belongs to a management, and baking it
 * into a token that outlives the handover would let a former finance director
 * keep the ledger until the token expired. Until the backend exists to resolve
 * that from the real membership data, `resolveSessionProfileByEmail` resolves
 * it from the same local mock data `mockAuthService` already reads — real
 * identity, demo org chart. Swapping that one lookup for a call to the backend
 * is the entire migration once it exists.
 */
let pool: CognitoUserPool | null = null

function isConfigured(): boolean {
  return Boolean(env.cognito.userPoolId && env.cognito.clientId)
}

function getPool(): CognitoUserPool {
  if (!isConfigured()) {
    throw new AuthError(
      'Cognito ainda não está configurado. Cadastre VITE_COGNITO_USER_POOL_ID e ' +
        'VITE_COGNITO_CLIENT_ID, ou use VITE_AUTH_SOURCE=mock para a demonstração.',
    )
  }
  pool ??= new CognitoUserPool({
    UserPoolId: env.cognito.userPoolId,
    ClientId: env.cognito.clientId,
    Storage: cognitoStorage,
  })
  return pool
}

function userFor(email: string): CognitoUser {
  return new CognitoUser({
    Username: email.trim(),
    Pool: getPool(),
    Storage: cognitoStorage,
  })
}

/**
 * Cognito's own wording is meant for a developer reading CloudWatch, not for
 * whoever is stuck on the login screen. Mapped to the same messages
 * `mockAuthService` already uses, so which service answered is not something
 * the reader can tell from the wording.
 */
function describeFailure(err: unknown): string {
  const code = err instanceof Error ? err.name : ''
  const message = err instanceof Error ? err.message : ''
  switch (code) {
    case 'NotAuthorizedException':
    case 'UserNotFoundException':
      return 'E-mail ou senha incorretos.'
    case 'UserNotConfirmedException':
      return 'Sua conta ainda não foi confirmada. Fale com a presidência da sua EJ.'
    case 'PasswordResetRequiredException':
      return 'Sua senha precisa ser redefinida. Fale com a presidência da sua EJ.'
    case 'InvalidPasswordException':
      return describePasswordPolicyFailure(message)
    default:
      return message || 'Não foi possível entrar.'
  }
}

/**
 * What each fragment of Cognito's `InvalidPasswordException` means, in the
 * reader's language — its own message never is: "Password does not conform to
 * policy: Password must have uppercase characters".
 */
const PASSWORD_POLICY_REASONS: Record<string, string> = {
  'Password must have uppercase characters': 'ter letra maiúscula',
  'Password must have lowercase characters': 'ter letra minúscula',
  'Password must have numeric characters': 'ter número',
  'Password must have symbol characters': 'ter símbolo (ex.: ! @ # $)',
  'Password not long enough': 'ser mais longa',
}

function describePasswordPolicyFailure(message: string): string {
  const reason = message.split(':').at(-1)?.trim()
  const translated = reason && PASSWORD_POLICY_REASONS[reason]

  return translated
    ? `A senha precisa ${translated}.`
    : 'A senha não atende aos requisitos da sua EJ. Tente uma com letras maiúsculas, minúsculas, números e símbolos.'
}

/** Turns a live Cognito session into the domain `Session`, resolving cargo along the way. */
function toDomainSession(cognitoSession: CognitoUserSession): Session {
  const claims = cognitoSession.getIdToken().decodePayload()
  const enterpriseId = claims['custom:ejId'] as string | undefined
  const email = claims['email'] as string | undefined
  const sub = claims['sub'] as string | undefined

  if (!enterpriseId || !email || !sub) {
    throw new AuthError(
      'Sua conta não está associada a nenhuma empresa júnior. Fale com o suporte.',
    )
  }

  const profile = resolveSessionProfileByEmail(enterpriseId, email)
  if (!profile) {
    throw new AuthError(
      'Sua conta não tem cargo na gestão vigente. Fale com a presidência da sua EJ.',
    )
  }

  const user: User = {
    id: sub,
    enterpriseId,
    name: profile.name,
    email,
    role: profile.role,
    directorate: profile.directorate,
    avatarUrl: profile.avatarUrl,
    memberId: profile.memberId,
  }

  return {
    user,
    accessToken: cognitoSession.getAccessToken().getJwtToken(),
    expiresAt: cognitoSession.getAccessToken().getExpiration() * 1000,
  }
}

/**
 * Wraps a Cognito challenge call in a promise that resolves to the domain
 * `Session`, mapping success through `toDomainSession` and failure through
 * `describeFailure`.
 *
 * `signIn` and `completeNewPassword` both reduce to "call one SDK method, get
 * a session or an error back" — this is that shape written once. `invoke`
 * gets `resolve`/`reject` directly, rather than a fixed callback pair, so a
 * caller that needs an extra challenge branch (`signIn`'s
 * `newPasswordRequired`) can still route into the same `reject`.
 */
function toSessionPromise(
  invoke: (
    resolve: (session: CognitoUserSession) => void,
    reject: (err: unknown) => void,
  ) => void,
): Promise<Session> {
  return new Promise((resolve, reject) => {
    invoke((session) => {
      try {
        resolve(toDomainSession(session))
      } catch (cause) {
        reject(cause)
      }
    }, reject)
  })
}

export const cognitoAuthService: AuthService = {
  signIn({ email, password }: Credentials) {
    const cognitoUser = userFor(email)
    const details = new AuthenticationDetails({
      Username: email.trim(),
      Password: password,
    })

    return toSessionPromise((onSuccess, reject) =>
      cognitoUser.authenticateUser(details, {
        onSuccess,
        onFailure: (err) => reject(new AuthError(describeFailure(err))),
        // An administrator-created account's forced first sign-in: the
        // credentials were correct, but Cognito will not issue a session
        // until a real password replaces the temporary one.
        newPasswordRequired: () => {
          const challenge: NewPasswordChallenge = { email: email.trim(), token: cognitoUser }
          reject(new NewPasswordRequiredError(challenge))
        },
      }),
    )
  },

  completeNewPassword(challenge: NewPasswordChallenge, newPassword: string) {
    const cognitoUser = challenge.token as CognitoUser

    return toSessionPromise((onSuccess, reject) =>
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        {},
        { onSuccess, onFailure: (err) => reject(new AuthError(describeFailure(err))) },
      ),
    )
  },

  async signOut() {
    getPool().getCurrentUser()?.signOut()
  },

  restore() {
    if (!isConfigured()) return Promise.resolve(null)

    const cognitoUser = getPool().getCurrentUser()
    if (!cognitoUser) return Promise.resolve(null)

    return new Promise<Session | null>((resolve) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session || !session.isValid()) {
          resolve(null)
          return
        }
        try {
          resolve(toDomainSession(session))
        } catch {
          // The session is valid but the account has nowhere to resolve a
          // cargo — the same situation `signIn` refuses outright. On restore
          // there is no form to show an error on, so the reader is simply
          // signed out and finds out why the next time they try to sign in.
          resolve(null)
        }
      })
    })
  },
}
