import type { ID, IsoDate } from "./common";

/**
 * What the hours were spent on.
 *
 * Roughly half of the hours in a junior enterprise are not billable project
 * work, and a timesheet that cannot say so reports a team that looks idle while
 * it is running the enterprise.
 */
export type TimeEntryCategory =
  "project" | "internal" | "training" | "commercial" | "event";

/**
 * An hour of work, as the person who did it recorded it.
 *
 * There is no approval trail on purpose. The timesheet here is a guide, not a
 * punch clock: it exists so the team can see where the year is going — which
 * projects are eating the hours, who is carrying too much — and a queue of
 * hours waiting on a director's signature only ever produced two things, a
 * backlog and a habit of filling the week in from memory on the last day.
 * Every hour logged counts, and the number it produces is as honest as the
 * person who typed it, which is what it was going to be either way.
 */
export interface TimeEntry {
  id: ID;
  memberId: ID;
  /** Null for every category other than `project`. */
  projectId: ID | null;
  category: TimeEntryCategory;
  date: IsoDate;
  hours: number;
  description: string;
}
