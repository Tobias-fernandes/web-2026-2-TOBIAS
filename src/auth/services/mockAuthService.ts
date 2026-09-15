import type { Session } from '@/domain/types'
import { AuthError } from './AuthError'
import {
  DEMO_PASSWORD,
  DEMO_USERS,
  MOCK_SIGN_IN_LATENCY_MS,
  SESSION_DURATION_MS,
  SESSION_STORAGE_KEY,
} from './constants'
import type { AuthService, Credentials } from './types'

const delay = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_SIGN_IN_LATENCY_MS))

function persist(session: Session | null): void {
  try {
    if (session) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // No storage: the session lives only while the tab is open.
  }
}

export const mockAuthService: AuthService = {
  async signIn({ email, password }: Credentials) {
    await delay()

    const user = DEMO_USERS.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    )

    if (!user || password !== DEMO_PASSWORD) {
      throw new AuthError('E-mail ou senha incorretos.')
    }

    const session: Session = {
      user,
      accessToken: `demo.${user.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    }

    persist(session)
    return session
  },

  async signOut() {
    persist(null)
  },

  async restore() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return null

      const session = JSON.parse(raw) as Session
      if (session.expiresAt < Date.now()) {
        persist(null)
        return null
      }

      return session
    } catch {
      return null
    }
  },
}
