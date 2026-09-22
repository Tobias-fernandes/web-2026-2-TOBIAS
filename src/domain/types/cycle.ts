import type { ID, IsoDate } from './common'

export type CycleStatus = 'planned' | 'active' | 'closed'

/**
 * Targets the board commits to at the start of the term. The dashboard measures
 * everything else against these four numbers.
 */
export interface CycleGoals {
  revenueCents: number
  projects: number
  members: number
  /** Average client satisfaction, 0-10, collected when a project is delivered. */
  npsScore: number
}

/**
 * One management of the junior enterprise — the board that runs a year and the
 * goals it set.
 *
 * It carries no name. An EJ does not christen its terms: it says "a gestão de
 * 2026", which is the year it opened in, so the label is read from `startsAt`
 * by `describeCycle` instead of being a field somebody has to type.
 *
 * This is the backbone of the model. A junior enterprise replaces its whole
 * board every year, so a position, a goal or a revenue figure only means
 * anything when it is attached to the term it belongs to. Without this entity
 * the history is overwritten at every handover.
 */
export interface Cycle {
  id: ID
  startsAt: IsoDate
  /**
   * Null while the management is open.
   *
   * A board does not know the day it hands over: the date depends on when the
   * next election actually happens, and asking for it at the start only ever
   * produced a guess that nobody went back to correct. It is stamped when the
   * management is closed, which is the day it becomes known.
   *
   * Nothing measures against a null. `cycleEnd` in `domain/rules` answers "what
   * period is this being read over" for the reports.
   */
  endsAt: IsoDate | null
  status: CycleStatus
  goals: CycleGoals
  createdAt: IsoDate
}
