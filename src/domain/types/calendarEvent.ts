import type { Directorate } from "./directorate";
import type { ID, IsoDate, IsoTime } from "./common";

/**
 * What the commitment is.
 *
 * The kind is not decoration: a junior enterprise's calendar mixes things with
 * very different weights — a directorate meeting, a training that counts as
 * hours, the day a selection process closes — and a member scanning the month
 * needs to tell them apart before reading a single title.
 */
export type EventKind =
  | "meeting"
  | "training"
  | "selection"
  | "commercial"
  | "external"
  | "social"
  | "deadline";

/** Who is expected: everyone, or only the area that called it. */
export type EventAudience = "enterprise" | "directorate";

/**
 * Cancelled rather than deleted.
 *
 * Whoever blocked their Tuesday evening has to see that the meeting is off —
 * an event that simply disappears from the calendar looks like a bug, and the
 * person shows up anyway.
 */
export type EventStatus = "scheduled" | "cancelled";

/**
 * Something on the enterprise's calendar: a meeting, a training, an event.
 *
 * Belongs to a management like every other record here, so the calendar of a
 * board that has handed over stays readable instead of bleeding into the next
 * one's month view.
 */
export interface CalendarEvent {
  id: ID;
  cycleId: ID;
  title: string;
  kind: EventKind;
  /** The area that called it — and who `directorate` means as an audience. */
  directorate: Directorate;
  audience: EventAudience;
  startsAt: IsoDate;
  /** The same day for most; later for a trip, a selection week, a congress. */
  endsAt: IsoDate;
  allDay: boolean;
  /** Both null on an all-day event. */
  startTime: IsoTime | null;
  endTime: IsoTime | null;
  location: string;
  /** Meeting link, for what happens remotely — half of an EJ's agenda does. */
  onlineUrl: string | null;
  description: string;
  /** Set when the commitment belongs to a project: kickoff, checkpoint, entrega. */
  projectId: ID | null;
  status: EventStatus;
  /** Who scheduled it, so there is someone to ask. */
  createdBy: ID;
  createdAt: IsoDate;
}
