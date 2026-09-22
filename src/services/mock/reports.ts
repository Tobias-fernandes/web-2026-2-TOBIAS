import {
  DEAL_STAGE_ORDER,
  describeCycle,
  TIME_ENTRY_CATEGORY_ORDER,
} from '@/domain/constants'
import { cycleEnd, isCountableProject, isOpenDeal } from '@/domain/rules'
import type {
  CashFlowSummary,
  CycleProgress,
  DashboardMetrics,
  DealStage,
  FunnelSummary,
  HoursByCategory,
  ID,
  IsoDate,
  MemberWorkload,
  Project,
  ProjectMargin,
} from '@/domain/types'
import { DAYS_IN_WEEK, daysBetween, elapsedShare, todayIso } from '@/lib/date'
import type { ReportScope, ReportService } from '@/services/types'
import {
  allocations,
  clients,
  cycles,
  deals,
  finance,
  members,
  memberships,
  projects,
  timeEntries,
} from './repositories'

const sum = <T>(items: T[], value: (item: T) => number) =>
  items.reduce((total, item) => total + value(item), 0)

const ratio = (part: number, whole: number) => (whole > 0 ? part / whole : 0)

/**
 * Every report is read for one term.
 *
 * Without this default each screen would answer a different question — the
 * dashboard summing the whole history while the goals panel summed a semester —
 * and the two would disagree in front of the board. The active cycle is the
 * scope unless the caller names another.
 */
async function resolveScope(scope: ReportScope = {}) {
  const all = await cycles.list()
  const cycle =
    all.find((item) => item.id === scope.cycleId) ??
    all.find((item) => item.status === 'active') ??
    all[0] ??
    null

  return {
    cycle,
    cycleId: cycle?.id,
    from: scope.from ?? cycle?.startsAt,
    to: scope.to ?? (cycle ? cycleEnd(cycle) : undefined),
  }
}

const averageNps = (items: Project[]): number | null => {
  const scored = items.filter((project) => project.npsScore !== null)
  if (scored.length === 0) return null
  return sum(scored, (project) => project.npsScore ?? 0) / scored.length
}

export const mockReports: ReportService = {
  async dashboardMetrics(scope: ReportScope = {}): Promise<DashboardMetrics> {
    const { cycleId, from, to } = await resolveScope(scope)

    const [cycleProjects, cycleMemberships, allClients, entries, cycleDeals, ledger] =
      await Promise.all([
        projects.listBy({ cycleId }),
        memberships.listBy({ cycleId }),
        clients.list(),
        timeEntries.listBy({ from, to }),
        deals.listBy({ cycleId }),
        finance.listBy({ cycleId }),
      ])

    const countable = cycleProjects.filter(isCountableProject)
    const open = cycleDeals.filter(isOpenDeal)

    const withStatus = (status: Project['status']) =>
      cycleProjects.filter((project) => project.status === status).length

    return {
      projectsInProgress: withStatus('inProgress') + withStatus('review'),
      projectsDelivered: withStatus('delivered'),
      projectsPlanning: withStatus('planning'),
      activeMembers: cycleMemberships.length,
      activeClients: allClients.filter((client) => client.status === 'active').length,
      loggedHours: sum(entries, (entry) => entry.hours),
      contractedRevenueCents: sum(countable, (project) => project.contractValueCents),
      receivedRevenueCents: sum(
        ledger.filter((line) => line.kind === 'receivable' && line.paidAt !== null),
        (line) => line.amountCents,
      ),
      openPipelineCents: sum(open, (deal) => deal.valueCents),
      averageNps: averageNps(countable),
    }
  },

  async cycleProgress(cycleId: ID): Promise<CycleProgress | null> {
    const cycle = await cycles.get(cycleId)
    if (!cycle) return null

    const [cycleProjects, cycleMemberships] = await Promise.all([
      projects.listBy({ cycleId }),
      memberships.listBy({ cycleId }),
    ])

    const countable = cycleProjects.filter(isCountableProject)
    const nps = averageNps(countable)

    const contracted = sum(countable, (project) => project.contractValueCents)

    return {
      cycleId: cycle.id,
      cycleName: describeCycle(cycle),
      startsAt: cycle.startsAt,
      endsAt: cycleEnd(cycle),
      elapsed: elapsedShare(cycle.startsAt, cycleEnd(cycle)),
      goals: [
        {
          label: 'Faturamento contratado',
          target: cycle.goals.revenueCents,
          current: contracted,
          ratio: ratio(contracted, cycle.goals.revenueCents),
          format: 'money',
        },
        {
          label: 'Projetos fechados',
          target: cycle.goals.projects,
          current: countable.length,
          ratio: ratio(countable.length, cycle.goals.projects),
          format: 'count',
        },
        {
          label: 'Membros na gestão',
          target: cycle.goals.members,
          current: cycleMemberships.length,
          ratio: ratio(cycleMemberships.length, cycle.goals.members),
          format: 'count',
        },
        {
          label: 'Satisfação do cliente',
          target: cycle.goals.npsScore,
          current: nps ?? 0,
          ratio: ratio(nps ?? 0, cycle.goals.npsScore),
          format: 'score',
        },
      ],
    }
  },

  async workloadByMember(scope: ReportScope = {}): Promise<MemberWorkload[]> {
    const { cycleId, from, to } = await resolveScope(scope)
    const today = todayIso()

    const [allMembers, cycleMemberships, entries, openAllocations] = await Promise.all([
      members.list(),
      memberships.listBy({ cycleId }),
      timeEntries.listBy({ from, to }),
      allocations.listBy({ activeOn: today }),
    ])

    // Hours the member was supposed to have given by today, not by the end of
    // the management: comparing a September timesheet against a December
    // commitment would put the whole team in the red.
    const periodEnd = to && to < today ? to : today

    /**
     * Counted from the day the person actually took the position, not from the
     * day the management opened. A trainee admitted in August owes eight weeks
     * of hours, and measuring them against the whole year reports them as idle
     * on their first week — which is exactly the person a people director must
     * not be given a false alarm about.
     */
    const weeksFor = (startsAt: IsoDate) => {
      const start = startsAt > (from ?? startsAt) ? startsAt : (from ?? startsAt)
      return Math.max(1, daysBetween(start, periodEnd) / DAYS_IN_WEEK)
    }

    const byId = new Map(allMembers.map((member) => [member.id, member]))

    return cycleMemberships
      .flatMap((membership) => {
        const member = byId.get(membership.memberId)
        if (!member) return []

        const own = entries.filter((entry) => entry.memberId === member.id)
        const mine = openAllocations.filter(
          (allocation) => allocation.memberId === member.id,
        )
        const expected = membership.weeklyHours * weeksFor(membership.startsAt)
        const logged = sum(own, (entry) => entry.hours)
        const allocated = sum(mine, (allocation) => allocation.weeklyHours)

        return [
          {
            memberId: member.id,
            name: member.name,
            role: membership.role,
            status: member.status,
            committedWeeklyHours: membership.weeklyHours,
            allocatedWeeklyHours: allocated,
            loggedHours: logged,
            utilization: ratio(logged, expected),
            overload: ratio(allocated, membership.weeklyHours),
            activeProjects: new Set(mine.map((item) => item.projectId)).size,
          },
        ]
      })
      .sort((a, b) => b.loggedHours - a.loggedHours)
  },

  async projectMargins(cycleId?: ID): Promise<ProjectMargin[]> {
    const scoped = await resolveScope({ cycleId })

    const [cycleProjects, allClients, entries] = await Promise.all([
      projects.listBy({ cycleId: scoped.cycleId }),
      clients.list(),
      // Every hour the project ever consumed, not the ones inside a period:
      // a contract's margin is its whole life.
      timeEntries.listBy({}),
    ])

    const clientName = new Map(allClients.map((client) => [client.id, client.name]))

    // One pass to group, instead of rescanning every entry once per project.
    const hoursByProject = new Map<ID, number>()
    for (const entry of entries) {
      if (!entry.projectId) continue
      hoursByProject.set(
        entry.projectId,
        (hoursByProject.get(entry.projectId) ?? 0) + entry.hours,
      )
    }

    return cycleProjects
      .filter(isCountableProject)
      .map((project) => {
        const logged = hoursByProject.get(project.id) ?? 0

        return {
          projectId: project.id,
          name: project.name,
          clientName: clientName.get(project.clientId) ?? '—',
          contractValueCents: project.contractValueCents,
          estimatedHours: project.estimatedHours,
          loggedHours: logged,
          hoursUsage: ratio(logged, project.estimatedHours),
          estimatedHourlyRateCents: Math.round(
            ratio(project.contractValueCents, project.estimatedHours),
          ),
          realizedHourlyRateCents:
            logged > 0 ? Math.round(project.contractValueCents / logged) : null,
        }
      })
      .sort((a, b) => b.loggedHours - a.loggedHours)
  },

  async hoursByCategory(scope: ReportScope = {}): Promise<HoursByCategory[]> {
    const { from, to } = await resolveScope(scope)
    const entries = await timeEntries.listBy({ from, to })
    const total = sum(entries, (entry) => entry.hours)

    return TIME_ENTRY_CATEGORY_ORDER.map((category) => {
      const hours = sum(
        entries.filter((entry) => entry.category === category),
        (entry) => entry.hours,
      )
      return { category, hours, share: ratio(hours, total) }
    })
  },

  async funnel(scope: ReportScope = {}): Promise<FunnelSummary> {
    const { cycleId } = await resolveScope(scope)
    const cycleDeals = await deals.listBy({ cycleId })

    const inStage = (stage: DealStage) =>
      cycleDeals.filter((deal) => deal.stage === stage)

    const won = inStage('won')
    const lost = inStage('lost')
    const closed = [...won, ...lost].filter((deal) => deal.closedAt !== null)
    const open = cycleDeals.filter(isOpenDeal)

    const sources = [...new Set(cycleDeals.map((deal) => deal.source))]
    const reasons = [...new Set(lost.map((deal) => deal.lossReason ?? 'other'))]

    return {
      stages: DEAL_STAGE_ORDER.map((stage) => ({
        stage,
        count: inStage(stage).length,
        valueCents: sum(inStage(stage), (deal) => deal.valueCents),
      })),
      conversion: ratio(won.length, won.length + lost.length),
      averageDaysToClose:
        closed.length > 0
          ? Math.round(
              sum(closed, (deal) => daysBetween(deal.createdAt, deal.closedAt ?? deal.createdAt)) /
                closed.length,
            )
          : null,
      openValueCents: sum(open, (deal) => deal.valueCents),
      wonValueCents: sum(won, (deal) => deal.valueCents),
      bySource: sources
        .map((source) => {
          const fromSource = cycleDeals.filter((deal) => deal.source === source)
          const wonFromSource = fromSource.filter((deal) => deal.stage === 'won')
          return {
            source,
            deals: fromSource.length,
            won: wonFromSource.length,
            conversion: ratio(wonFromSource.length, fromSource.length),
            wonValueCents: sum(wonFromSource, (deal) => deal.valueCents),
          }
        })
        .sort((a, b) => b.deals - a.deals),
      lossReasons: reasons
        .map((reason) => ({
          reason,
          count: lost.filter((deal) => (deal.lossReason ?? 'other') === reason).length,
        }))
        .sort((a, b) => b.count - a.count),
    }
  },

  async cashFlow(scope: ReportScope = {}): Promise<CashFlowSummary> {
    const { cycleId } = await resolveScope(scope)
    const ledger = await finance.listBy({ cycleId })
    const today = todayIso()

    const of = (kind: 'receivable' | 'payable', settled: boolean) =>
      ledger.filter((line) => line.kind === kind && (line.paidAt !== null) === settled)

    const received = sum(of('receivable', true), (line) => line.amountCents)
    const paid = sum(of('payable', true), (line) => line.amountCents)

    return {
      receivedCents: received,
      toReceiveCents: sum(of('receivable', false), (line) => line.amountCents),
      overdueCents: sum(
        of('receivable', false).filter((line) => line.dueAt < today),
        (line) => line.amountCents,
      ),
      paidCents: paid,
      toPayCents: sum(of('payable', false), (line) => line.amountCents),
      balanceCents: received - paid,
    }
  },
}
