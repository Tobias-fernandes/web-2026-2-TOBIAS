import type { ID } from './common'
import type { MemberRole } from './member'

/** Authenticated user. Mirrors the claims expected from a Cognito id token. */
export interface User {
  id: ID
  name: string
  email: string
  role: MemberRole
  memberId: ID | null
}

export interface Session {
  user: User
  /** Sent as the Authorization bearer token on every API call. */
  accessToken: string
  expiresAt: number
}
