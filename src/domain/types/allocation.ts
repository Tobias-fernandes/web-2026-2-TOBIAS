import type { ID, IsoDate } from './common'

/**
 * Planned load: how many hours a week a member is expected to give a project,
 * over a stretch of the term.
 *
 * The counterpart of `TimeEntry`, which is what actually happened. Keeping the
 * two apart is what makes overload and idleness visible *before* the term ends —
 * a member allocated across three projects is a number here, not a complaint in
 * the group chat later.
 */
export interface Allocation {
  id: ID
  memberId: ID
  projectId: ID
  weeklyHours: number
  startsAt: IsoDate
  endsAt: IsoDate
  createdAt: IsoDate
}
