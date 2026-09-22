import type {
  DealStage,
  EventKind,
  ProjectStatus,
  TimeEntryCategory,
} from '@/domain/types'

/** Column order on the project board. Cancelled projects are not shown there. */
export const PROJECT_BOARD_COLUMNS: ProjectStatus[] = [
  'planning',
  'inProgress',
  'review',
  'delivered',
]

/** Column order on the commercial funnel. Won and lost leave the board. */
export const DEAL_FUNNEL_COLUMNS: DealStage[] = [
  'qualification',
  'diagnosis',
  'proposal',
  'negotiation',
]

/**
 * Every stage, in funnel order, with the two closed ones at the end.
 *
 * The funnel report used to re-type this list inline; one ordered source keeps
 * a new stage from having to be remembered in two places.
 */
export const DEAL_STAGE_ORDER: DealStage[] = [
  ...DEAL_FUNNEL_COLUMNS,
  'won',
  'lost',
]

/** Order the categories are reported in — billable work first. */
export const TIME_ENTRY_CATEGORY_ORDER: TimeEntryCategory[] = [
  'project',
  'commercial',
  'internal',
  'training',
  'event',
]

/** Statuses that count as a project consuming the team's time right now. */
export const ACTIVE_PROJECT_STATUSES: ProjectStatus[] = [
  'planning',
  'inProgress',
  'review',
]

/** Order the kinds are offered in — what an EJ schedules most, first. */
export const EVENT_KIND_ORDER: EventKind[] = [
  'meeting',
  'training',
  'commercial',
  'selection',
  'external',
  'social',
  'deadline',
]
