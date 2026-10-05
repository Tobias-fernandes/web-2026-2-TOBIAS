import type { ID, IsoDate } from "./common";

export type CycleStatus = "planned" | "active" | "closed";

/**
 * Targets the board commits to at the start of the term. The dashboard measures
 * everything else against these four numbers.
 */
export interface CycleGoals {
  revenueCents: number;
  projects: number;
  members: number;
  /** Average client satisfaction, 0-10, collected when a project is delivered. */
  npsScore: number;
}

/**
 * Where a management stood on the day the EJ started using the system.
 *
 * A president can adopt the system halfway through the year, with money in the
 * account and contracts already signed. Without these figures the dashboard
 * would open at zero and tell a board that closed half its revenue goal that it
 * has not started — and the cash balance would be wrong from the first day.
 *
 * They are a snapshot, not a record: whatever happened before `recordedAt`
 * lives here, and whatever happens after is registered normally. Registering
 * one of those earlier projects or payments again would count it twice.
 */
export interface CycleStartingPoint {
  /** The day the figures below were true — the day the EJ signed up. */
  recordedAt: IsoDate;
  /** Money in the account that day. Can be negative, for an EJ in debt. */
  balanceCents: number;
  /**
   * Contract value of the projects this management had already delivered.
   * Projects still running are registered as projects instead, and count
   * towards the goals from there — so they are not in this figure.
   */
  contractedRevenueCents: number;
  /** How many projects this management had already delivered. */
  deliveredProjects: number;
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
  id: ID;
  startsAt: IsoDate;
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
  endsAt: IsoDate | null;
  status: CycleStatus;
  goals: CycleGoals;
  /**
   * Null when the management started with the system, which is every one but
   * the first of an EJ that signed up mid-term.
   */
  startingPoint: CycleStartingPoint | null;
  createdAt: IsoDate;
}
