import { DEMO_ENTERPRISE_ID } from '@/config/storage'
import type { User } from '@/domain/types'

export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000

export const MOCK_SIGN_IN_LATENCY_MS = 380

/**
 * Shared password for every demo user. It is shown on the login screen on
 * purpose: this is a showcase, not an access control. Nothing sensitive travels
 * through it, and the whole module is retired once Cognito takes over.
 */
export const DEMO_PASSWORD = 'altotech'

/**
 * One user per permission shape, so the demo can show what each one sees:
 * the presidency sees everything, a director writes only in their own area, a
 * project manager reads the whole team's week, a trainee only their own.
 */
export const DEMO_USERS: User[] = [
  {
    id: 'usr-1',
    enterpriseId: DEMO_ENTERPRISE_ID,
    name: 'Tobias Fernandes',
    email: 'tobias@altotech.ej.br',
    role: 'president',
    directorate: 'presidency',
    avatarUrl: null,
    memberId: 'mem-1',
  },
  {
    id: 'usr-2',
    enterpriseId: DEMO_ENTERPRISE_ID,
    name: 'Caio Bezerra',
    email: 'caio@altotech.ej.br',
    role: 'director',
    directorate: 'projects',
    avatarUrl: null,
    memberId: 'mem-3',
  },
  {
    id: 'usr-3',
    enterpriseId: DEMO_ENTERPRISE_ID,
    name: 'Sofia Lira',
    email: 'sofia@altotech.ej.br',
    role: 'director',
    directorate: 'finance',
    avatarUrl: null,
    memberId: 'mem-8',
  },
  {
    id: 'usr-4',
    enterpriseId: DEMO_ENTERPRISE_ID,
    name: 'Beatriz Nogueira',
    email: 'beatriz@altotech.ej.br',
    role: 'trainee',
    directorate: 'commercial',
    avatarUrl: null,
    memberId: 'mem-6',
  },
]
