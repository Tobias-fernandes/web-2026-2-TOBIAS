import type { ID, Session } from '@/domain/types'

/**
 * Browser storage keys used across the app.
 *
 * Here rather than next to whoever reads them because two layers need the same
 * keys and must not import each other to get them: the demo repositories
 * resolve the active enterprise from storage, and the auth services (mock and
 * Cognito alike) write it. A shared module keeps that from becoming a cycle.
 */

export const SESSION_STORAGE_KEY = 'altotech:session:v3'

/**
 * The one place that reads or writes the stored session.
 *
 * Three different callers — the mock auth service, the sign-up service, and
 * the tenant-scoped storage resolving whose data to serve — all need the same
 * session, and each had grown its own `JSON.parse`/try-catch guessing its
 * shape. One parse, one shape, read here instead of copied three times.
 */
export function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function writeStoredSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // No persistence available; the session lives only while the tab is open.
  }
}

/**
 * Which enterprise's demo data applies to the signed-in reader.
 *
 * Kept apart from `readStoredSession` on purpose: `readStoredSession` only
 * ever holds the mock session, whose `accessToken` is a harmless placeholder
 * string, while a real Cognito session's access token is a live bearer
 * credential that must never sit in `localStorage` (see `cognitoStorage`,
 * which keeps it in `sessionStorage` instead). Tenant-scoped storage still
 * needs to know *which* enterprise's data to read regardless of which auth
 * path signed the reader in, so this carries only that one, non-sensitive
 * fact — never the token.
 *
 * Written from exactly one place — `useAuthStore`, right where `session`
 * itself is set — rather than by each `AuthService` implementation. Every
 * sign-in, sign-out and restore already passes through there uniformly
 * regardless of which service is active; letting each implementation also
 * remember to keep this in sync is how it drifts.
 */
const ACTIVE_ENTERPRISE_KEY = 'altotech:active-enterprise'

export function readActiveEnterpriseId(): ID | null {
  try {
    return localStorage.getItem(ACTIVE_ENTERPRISE_KEY)
  } catch {
    return null
  }
}

export function writeActiveEnterpriseId(enterpriseId: ID | null): void {
  try {
    if (enterpriseId) localStorage.setItem(ACTIVE_ENTERPRISE_KEY, enterpriseId)
    else localStorage.removeItem(ACTIVE_ENTERPRISE_KEY)
  } catch {
    // No persistence available; the demo falls back to its default tenant.
  }
}

/**
 * Prefix for every demo record kept in localStorage.
 *
 * Versioned: the demo data has been reshaped before, and a browser holding an
 * older copy would feed the screens records that no longer fit the model —
 * v4 is where each record started belonging to an enterprise. Bumping the
 * prefix retires the old data instead of migrating a demonstration.
 */
export const DEMO_STORAGE_PREFIX = 'altotech:demo:v4:'

/** The enterprise the seed data belongs to. A signed-up EJ starts empty. */
export const DEMO_ENTERPRISE_ID = 'ej-altotech'
