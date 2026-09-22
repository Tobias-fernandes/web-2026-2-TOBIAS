import type { Directorate, ID, MemberRole } from '@/domain/types'
import { SEED_CYCLES, SEED_MEMBERS, SEED_MEMBERSHIPS, SEED_WORK_AREAS } from './seed'
import { readCollectionOrSeed } from './tenantStorage'

export interface SessionProfile {
  role: MemberRole
  directorate: Directorate
}

/**
 * The position a person holds right now, resolved from their enterprise's data.
 *
 * Read at sign-in rather than stored on the account, because a position belongs
 * to a management and managements change: a token minted while somebody was
 * finance director would otherwise keep opening the ledger for them long after
 * the handover.
 *
 * Answers null when the person holds no position in the open term — an invited
 * member who has not accepted, or someone whose term ended. That is not a
 * failure to look up; it is the honest answer, and the caller refuses the
 * sign-in rather than inventing a role.
 */
export function resolveSessionProfile(
  enterpriseId: ID,
  memberId: ID,
): SessionProfile | null {
  const cycles = readCollectionOrSeed('cycles', SEED_CYCLES, enterpriseId)
  const openCycle =
    cycles.find((cycle) => cycle.status === 'active') ??
    [...cycles].sort((a, b) => b.startsAt.localeCompare(a.startsAt))[0]
  if (!openCycle) return null

  const memberships = readCollectionOrSeed('memberships', SEED_MEMBERSHIPS, enterpriseId)
  const membership = memberships.find(
    (item) => item.memberId === memberId && item.cycleId === openCycle.id,
  )
  if (!membership) return null

  const areas = readCollectionOrSeed('work-areas', SEED_WORK_AREAS, enterpriseId)
  const area = areas.find((item) => item.id === membership.workAreaId)
  if (!area) return null

  return { role: membership.role, directorate: area.directorate }
}

export interface AuthenticatedMember extends SessionProfile {
  memberId: ID
  name: string
  avatarUrl: string | null
}

/**
 * The same lookup as `resolveSessionProfile`, but starting from an e-mail
 * instead of a member id.
 *
 * Cognito authenticates a person by e-mail and knows nothing about member
 * records — `sub` and `custom:ejId` are the only claims in its token. This is
 * the bridge between "this e-mail proved it owns this Cognito account" and
 * "this is who they are in the enterprise's own data," standing in for the
 * lookup the backend will do once it exists.
 */
export function resolveSessionProfileByEmail(
  enterpriseId: ID,
  email: string,
): AuthenticatedMember | null {
  const members = readCollectionOrSeed('members', SEED_MEMBERS, enterpriseId)
  const wanted = email.trim().toLowerCase()
  const member = members.find((item) => item.email.toLowerCase() === wanted)
  if (!member) return null

  const profile = resolveSessionProfile(enterpriseId, member.id)
  if (!profile) return null

  return {
    ...profile,
    memberId: member.id,
    name: member.name,
    avatarUrl: member.avatarUrl,
  }
}
