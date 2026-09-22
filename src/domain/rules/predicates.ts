import { ACTIVE_PROJECT_STATUSES, DEAL_FUNNEL_COLUMNS } from '@/domain/constants'
import type { CalendarEvent, Cycle, Deal, IsoDate, Project } from '@/domain/types'

/**
 * Questions the whole system asks about a record.
 *
 * They live here because each of them was being answered by hand at several
 * call sites — "a deal is open when its stage is neither won nor lost" was
 * written out in the report engine twice and in the funnel screen once, which
 * is three places to visit the day an EJ wants a "paused" stage.
 */

/** Still moving through the funnel: neither won nor lost. */
export const isOpenDeal = (deal: Deal): boolean =>
  DEAL_FUNNEL_COLUMNS.includes(deal.stage)

/**
 * Counts towards the management's figures.
 *
 * A cancelled contract is kept for the history but never enters revenue, goal
 * or margin — reporting it would inflate a term with work nobody did.
 */
export const isCountableProject = (project: Project): boolean =>
  project.status !== 'cancelled'

/** Consuming the team's time right now, as opposed to closed or cancelled. */
export const isActiveProject = (project: Project): boolean =>
  ACTIVE_PROJECT_STATUSES.includes(project.status)

/** Still on: a cancelled commitment stays on the calendar, struck through. */
export const isScheduledEvent = (event: CalendarEvent): boolean =>
  event.status === 'scheduled'

/**
 * The day a management is measured against.
 *
 * While it is open there is no handover date yet, and every goal here is read
 * as "how far along the year are we" — so the outer edge of the year it opened
 * in is the honest denominator. Once closed, the real date takes over.
 *
 * Presuming the turn of the year rather than a guessed handover keeps the pace
 * slightly conservative, which is the right direction to be wrong in: it never
 * tells a board it is ahead when it is not.
 */
export const cycleEnd = (cycle: Cycle): IsoDate =>
  cycle.endsAt ?? `${cycle.startsAt.slice(0, 4)}-12-31`
