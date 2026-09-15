import type { User } from '@/domain/types'

export const SESSION_STORAGE_KEY = 'altotech:session'

export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000

export const MOCK_SIGN_IN_LATENCY_MS = 380

/**
 * Shared password for every demo user. It is shown on the login screen on
 * purpose: this is a showcase, not an access control. Nothing sensitive travels
 * through it, and the whole module is retired once Cognito takes over.
 */
export const DEMO_PASSWORD = 'altotech'

export const DEMO_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Tobias Fernandes',
    email: 'tobias@altotech.ej.br',
    role: 'president',
    memberId: 'mem-1',
  },
  {
    id: 'usr-2',
    name: 'Larissa Moura',
    email: 'larissa@altotech.ej.br',
    role: 'director',
    memberId: 'mem-2',
  },
  {
    id: 'usr-3',
    name: 'Beatriz Nogueira',
    email: 'beatriz@altotech.ej.br',
    role: 'trainee',
    memberId: 'mem-6',
  },
]
