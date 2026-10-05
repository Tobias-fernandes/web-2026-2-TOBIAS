import type {
  DealStage,
  EventKind,
  MemberRole,
  ProjectStatus,
  TimeEntryCategory,
} from "@/domain/types";

/** Column order on the project board. Cancelled projects are not shown there. */
export const PROJECT_BOARD_COLUMNS: ProjectStatus[] = [
  "planning",
  "inProgress",
  "review",
  "delivered",
];

/** Column order on the commercial funnel. Won and lost leave the board. */
export const DEAL_FUNNEL_COLUMNS: DealStage[] = [
  "qualification",
  "diagnosis",
  "proposal",
  "negotiation",
];

/**
 * Every stage, in funnel order, with the two closed ones at the end.
 *
 * The funnel report used to re-type this list inline; one ordered source keeps
 * a new stage from having to be remembered in two places.
 */
export const DEAL_STAGE_ORDER: DealStage[] = [
  ...DEAL_FUNNEL_COLUMNS,
  "won",
  "lost",
];

/**
 * The categories in report order — billable work first, and the member's
 * development (training, then independent study) together.
 *
 * Keyed by category rather than written as a list so a new category cannot be
 * forgotten: the report only sums the categories listed here, and a list that
 * missed one would drop its hours from the breakdown while they still counted
 * in the total — shares adding up to less than 100%, with nothing to say why.
 * The order is the key order, which JavaScript preserves.
 */
const TIME_ENTRY_CATEGORIES_IN_ORDER: Record<TimeEntryCategory, true> = {
  project: true,
  commercial: true,
  internal: true,
  training: true,
  studying: true,
  event: true,
};

/** Order the categories are reported in — billable work first. */
export const TIME_ENTRY_CATEGORY_ORDER = Object.keys(
  TIME_ENTRY_CATEGORIES_IN_ORDER,
) as TimeEntryCategory[];

/** Statuses that count as a project consuming the team's time right now. */
export const ACTIVE_PROJECT_STATUSES: ProjectStatus[] = [
  "planning",
  "inProgress",
  "review",
];

/** Order the kinds are offered in — what an EJ schedules most, first. */
export const EVENT_KIND_ORDER: EventKind[] = [
  "meeting",
  "training",
  "commercial",
  "selection",
  "external",
  "social",
  "deadline",
];

/** Positions from the one that sees most to the one that sees least. */
export const MEMBER_ROLE_ORDER: MemberRole[] = [
  "president",
  "vicePresident",
  "director",
  "manager",
  "consultant",
  "trainee",
];
