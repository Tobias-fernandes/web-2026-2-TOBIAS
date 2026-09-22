import { readStoredSession, writeStoredSession } from '@/config/storage'
import type { Session, User } from '@/domain/types'
import { findAccount } from '@/services/mock/accounts'
import { resolveSessionProfile } from '@/services/mock/sessionProfile'
import { AuthError } from './AuthError'
import {
  DEMO_PASSWORD,
  DEMO_USERS,
  MOCK_SIGN_IN_LATENCY_MS,
  SESSION_DURATION_MS,
} from './constants'
import type { AuthService, Credentials } from './types'

const delay = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_SIGN_IN_LATENCY_MS))

/**
 * Two kinds of account share one door.
 *
 * The demo users are fixtures of the seeded enterprise, with a password printed
 * on the login screen. The others were registered through the sign-up form and
 * carry their own. Both end up as the same `User`; what differs is where the
 * position comes from — the fixtures state theirs, the registered ones have
 * theirs read from the management they belong to.
 */
function authenticate(email: string, password: string): User {
  const demoUser = DEMO_USERS.find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (demoUser) {
    if (password !== DEMO_PASSWORD) throw new AuthError('E-mail ou senha incorretos.')
    return demoUser
  }

  const account = findAccount(email)
  if (!account || account.password !== password) {
    throw new AuthError('E-mail ou senha incorretos.')
  }

  const profile = resolveSessionProfile(account.enterpriseId, account.memberId)
  if (!profile) {
    throw new AuthError(
      'Sua conta não tem cargo na gestão vigente. Fale com a presidência da sua EJ.',
    )
  }

  return {
    id: account.id,
    enterpriseId: account.enterpriseId,
    name: account.name,
    email: account.email,
    role: profile.role,
    directorate: profile.directorate,
    avatarUrl: null,
    memberId: account.memberId,
  }
}

export const mockAuthService: AuthService = {
  async signIn({ email, password }: Credentials) {
    await delay()

    const user = authenticate(email, password)

    const session: Session = {
      user,
      accessToken: `demo.${user.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    }

    writeStoredSession(session)
    return session
  },

  async completeNewPassword() {
    // Nothing in the demo forces a password change, so `signIn` never throws
    // `NewPasswordRequiredError` and this is never actually called.
    throw new AuthError('Este fluxo não existe na demonstração.')
  },

  async signOut() {
    writeStoredSession(null)
  },

  async restore() {
    const session = readStoredSession()
    if (!session) return null

    if (session.expiresAt < Date.now()) {
      writeStoredSession(null)
      return null
    }

    return session
  },
}
