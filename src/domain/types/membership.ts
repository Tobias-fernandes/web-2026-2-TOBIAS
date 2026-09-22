import type { ID, IsoDate } from './common'

/** Position held inside the junior enterprise. Drives permissions and reports. */
export type MemberRole =
  | 'president'
  | 'vicePresident'
  | 'director'
  | 'manager'
  | 'consultant'
  | 'trainee'

/**
 * A person's position in one term.
 *
 * The join between `Member` and `Cycle`. A consultant in 2025 who becomes
 * finance director in 2026 is two memberships, not an overwritten field, so
 * last term's reports keep saying what was true at the time.
 */
export interface Membership {
  id: ID
  memberId: ID
  cycleId: ID
  role: MemberRole
  /**
   * The area held in this term, named by the enterprise.
   *
   * Points at `WorkArea` rather than carrying the fixed function directly: the
   * function is read through the area, so an EJ renaming its areas never
   * rewrites the history of who did what.
   */
  workAreaId: ID
  /** Hours per week the member committed to for this term. */
  weeklyHours: number
  startsAt: IsoDate
  endsAt: IsoDate | null
  createdAt: IsoDate
}
