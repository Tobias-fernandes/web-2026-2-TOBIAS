import type { DealSource, DealStage, LossReason } from './deal'
import type { ID, IsoDate } from './common'
import type { MemberRole } from './membership'
import type { MemberStatus } from './member'
import type { TimeEntryCategory } from './timeEntry'

/** Consolidated figures behind the dashboard and the end-of-term report. */
export interface DashboardMetrics {
  projectsInProgress: number
  projectsDelivered: number
  projectsPlanning: number
  activeMembers: number
  activeClients: number
  /** Every hour logged in the term. The timesheet is a guide, not a gate. */
  loggedHours: number
  contractedRevenueCents: number
  receivedRevenueCents: number
  openPipelineCents: number
  averageNps: number | null
}

/** One goal of the term, with what has been achieved so far. */
export interface GoalProgress {
  label: string
  target: number
  current: number
  /** `current / target`, capped at nothing — over 1 means the goal was beaten. */
  ratio: number
  format: 'money' | 'count' | 'score'
}

export interface CycleProgress {
  cycleId: ID
  cycleName: string
  startsAt: IsoDate
  endsAt: IsoDate
  /** How much of the term has elapsed, 0-1. The pace to compare goals against. */
  elapsed: number
  goals: GoalProgress[]
}

/**
 * A member's load in one view: what they committed to, what they were planned
 * for, and what they actually logged.
 */
export interface MemberWorkload {
  memberId: ID
  name: string
  role: MemberRole
  /** Someone on leave is not idle, and the capacity screen must not say so. */
  status: MemberStatus
  /** Weekly hours agreed in the membership. */
  committedWeeklyHours: number
  /** Sum of the weekly hours of every allocation open today. */
  allocatedWeeklyHours: number
  loggedHours: number
  /** Logged over the hours expected across the period. */
  utilization: number
  /** Allocated over committed. Above 1 means the member is over-booked. */
  overload: number
  activeProjects: number
}

/**
 * What a project was worth against what it cost in hours.
 *
 * `realizedHourlyRateCents` is the figure that changes how a junior enterprise
 * prices: the contract divided by the hours it actually took.
 */
export interface ProjectMargin {
  projectId: ID
  name: string
  clientName: string
  contractValueCents: number
  estimatedHours: number
  loggedHours: number
  /** Logged over estimated. Above 1 means the budget was blown. */
  hoursUsage: number
  estimatedHourlyRateCents: number
  realizedHourlyRateCents: number | null
}

export interface HoursByCategory {
  category: TimeEntryCategory
  hours: number
  /** Share of the period's total, 0-1. */
  share: number
}

export interface FunnelStageSummary {
  stage: DealStage
  count: number
  valueCents: number
}

export interface SourceSummary {
  source: DealSource
  deals: number
  won: number
  conversion: number
  wonValueCents: number
}

export interface FunnelSummary {
  stages: FunnelStageSummary[]
  /** Won over (won + lost) — open deals are not counted either way. */
  conversion: number
  averageDaysToClose: number | null
  openValueCents: number
  wonValueCents: number
  bySource: SourceSummary[]
  lossReasons: { reason: LossReason; count: number }[]
}

export interface CashFlowSummary {
  receivedCents: number
  toReceiveCents: number
  overdueCents: number
  paidCents: number
  toPayCents: number
  /** Received minus paid: what actually moved through the account. */
  balanceCents: number
}
