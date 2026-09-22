import type {
  ClientStatus,
  CycleStatus,
  DealStage,
  EventKind,
  FinanceKind,
  MemberStatus,
  ProjectStatus,
  TimeEntryCategory,
} from "@/domain/types";
import type { Tone } from "./tone";

export const CYCLE_STATUS_TONES: Record<CycleStatus, Tone> = {
  planned: "violet",
  active: "green",
  closed: "neutral",
};

export const MEMBER_STATUS_TONES: Record<MemberStatus, Tone> = {
  invited: "violet",
  active: "green",
  onLeave: "amber",
  inactive: "neutral",
};

export const CLIENT_STATUS_TONES: Record<ClientStatus, Tone> = {
  lead: "neutral",
  negotiating: "amber",
  active: "green",
  closed: "neutral",
};

export const DEAL_STAGE_TONES: Record<DealStage, Tone> = {
  qualification: "neutral",
  diagnosis: "violet",
  proposal: "violet",
  negotiation: "amber",
  won: "green",
  lost: "neutral",
};

export const PROJECT_STATUS_TONES: Record<ProjectStatus, Tone> = {
  planning: "violet",
  inProgress: "amber",
  review: "violet",
  delivered: "green",
  cancelled: "neutral",
};

/** Billable project work is the one category set apart by colour. */
export const TIME_ENTRY_CATEGORY_TONES: Record<TimeEntryCategory, Tone> = {
  project: "violet",
  internal: "neutral",
  training: "green",
  commercial: "amber",
  event: "neutral",
};

export const FINANCE_KIND_TONES: Record<FinanceKind, Tone> = {
  receivable: "green",
  payable: "amber",
};

/**
 * Colour of a commitment on the month grid.
 *
 * Amber is reserved for what has a consequence if missed — a deadline, a client
 * meeting — so a month that is mostly amber reads as a tight month at a glance.
 */
export const EVENT_KIND_TONES: Record<EventKind, Tone> = {
  meeting: "violet",
  training: "green",
  selection: "violet",
  commercial: "amber",
  external: "neutral",
  social: "green",
  deadline: "amber",
};
