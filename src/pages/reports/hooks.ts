import { useEffect, useState } from 'react'
import { describeCycle } from '@/domain/constants'
import type { Cycle } from '@/domain/types'
import {
  useActiveCycle,
  useCycles,
  useDashboardMetrics,
  useHoursByCategory,
  useProjectMargins,
  useWorkloadByMember,
} from '@/queries'
import { buildEmptyPeriod } from './constants'
import type { ReportPeriodState, ReportsPageState } from './types'

/**
 * The end-of-term report's four reads, all scoped to the same period.
 *
 * Margin is the exception and takes only the management: a contract's hours are
 * its whole life, not a slice of it.
 */
/** The label of the management being read, or nothing while none is chosen. */
const describeSelected = (cycles: Cycle[], cycleId: string) => {
  const cycle = cycles.find((item) => item.id === cycleId)
  return cycle ? describeCycle(cycle) : ''
}

export function useReportsPage(): ReportsPageState {
  const { cycle: activeCycle } = useActiveCycle()
  const cycles = useCycles()

  const [period, setPeriod] = useState<ReportPeriodState>(() => buildEmptyPeriod(''))

  // Opens on the management in progress, then follows whatever the reader picks.
  useEffect(() => {
    if (!period.cycleId && activeCycle) setPeriod(buildEmptyPeriod(activeCycle.id))
  }, [activeCycle, period.cycleId])

  const scope = {
    cycleId: period.cycleId || undefined,
    from: period.from || undefined,
    to: period.to || undefined,
  }

  return {
    // Da mais nova para a mais velha, que é a ordem em que uma diretoria pensa
    // — e a mesma da tela de gestões.
    cycles: [...(cycles.data ?? [])].sort((a, b) =>
      b.startsAt.localeCompare(a.startsAt),
    ),
    period,
    setPeriod,
    resetPeriod: () => setPeriod(buildEmptyPeriod(period.cycleId)),
    cycleName: describeSelected(cycles.data ?? [], period.cycleId),
    metrics: useDashboardMetrics(scope),
    margins: useProjectMargins(period.cycleId || undefined),
    workload: useWorkloadByMember(scope),
    categories: useHoursByCategory(scope),
  }
}
