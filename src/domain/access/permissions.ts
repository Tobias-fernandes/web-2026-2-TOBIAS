import type { Directorate, MemberRole, User } from '@/domain/types'

/**
 * What a signed-in user is allowed to do.
 *
 * Three axes rather than one, because a junior enterprise is not a hierarchy of
 * trust levels: the finance director outranks nobody on the project board, and
 * a trainee still owns their own timesheet. So a permission is granted by the
 * position (`ROLE_PERMISSIONS`), by the area the person directs
 * (`DIRECTORATE_PERMISSIONS`), or by owning the record — the third axis, which
 * lives at the call site as `entry.memberId === user.memberId`.
 *
 * Keeping the rules here instead of spreading `role === 'president'` through the
 * screens means a new position is one entry in one table.
 */
export type Permission =
  | 'cycle:manage'
  | 'member:manage'
  | 'membership:manage'
  | 'client:manage'
  | 'deal:manage'
  | 'project:manage'
  | 'allocation:manage'
  | 'time:viewAll'
  | 'event:manage'
  | 'finance:view'
  | 'finance:manage'
  | 'report:viewAll'

const EVERYTHING: readonly Permission[] = [
  'cycle:manage',
  'member:manage',
  'membership:manage',
  'client:manage',
  'deal:manage',
  'project:manage',
  'allocation:manage',
  'time:viewAll',
  'event:manage',
  'finance:view',
  'finance:manage',
  'report:viewAll',
]

/** Granted by the position alone, whichever area the person belongs to. */
const ROLE_PERMISSIONS: Record<MemberRole, readonly Permission[]> = {
  president: EVERYTHING,
  vicePresident: EVERYTHING,
  // A director sees the whole picture but only writes in their own area; the
  // writing half comes from DIRECTORATE_PERMISSIONS below. The calendar is the
  // exception: any director schedules for the enterprise, because a meeting
  // called by marketing is still the whole EJ's Tuesday evening.
  director: ['report:viewAll', 'finance:view', 'event:manage'],
  manager: ['project:manage', 'allocation:manage', 'time:viewAll'],
  consultant: [],
  trainee: [],
}

/** Added on top for a director, over the area they lead. */
const DIRECTORATE_PERMISSIONS: Record<Directorate, readonly Permission[]> = {
  presidency: EVERYTHING,
  commercial: ['client:manage', 'deal:manage'],
  marketing: ['client:manage', 'deal:manage'],
  people: ['member:manage', 'membership:manage'],
  finance: ['finance:view', 'finance:manage'],
  projects: ['project:manage', 'allocation:manage', 'time:viewAll'],
}

const isAreaLead = (role: MemberRole) =>
  role === 'president' || role === 'vicePresident' || role === 'director'

export function permissionsOf(user: User | null): readonly Permission[] {
  if (!user) return []
  const fromRole = ROLE_PERMISSIONS[user.role]
  if (!isAreaLead(user.role)) return fromRole
  return [...new Set([...fromRole, ...DIRECTORATE_PERMISSIONS[user.directorate]])]
}

export function can(user: User | null, permission: Permission): boolean {
  return permissionsOf(user).includes(permission)
}
