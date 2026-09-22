import {
  Badge,
  EmptyState,
  ListState,
  ProgressBar,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import type { Loadable } from '@/components/ui'
import type { Tone } from '@/domain/constants'
import {
  IDLE_UTILIZATION,
  MEMBER_ROLE_LABELS,
  OVERLOAD_THRESHOLD,
} from '@/domain/constants'
import type { MemberWorkload } from '@/domain/types'
import { formatHours, formatPercent } from '@/lib/format'
import { CAPACITY_TABLE_HEADERS, RUNS_THE_ENTERPRISE } from './constants'

/**
 * The two situations worth a name.
 *
 * Over-booking is the one that burns a member out; being left out of every
 * project is the one that makes them leave. A director with no project is doing
 * their job, and someone on leave is not idle — without those two exceptions the
 * screen would cry wolf at half the board and the real warning would stop being
 * read.
 */
function capacityLabel(row: MemberWorkload): { tone: Tone; label: string } {
  if (row.status === 'onLeave') return { tone: 'neutral', label: 'Afastado' }
  if (row.overload > OVERLOAD_THRESHOLD) {
    return { tone: 'amber', label: 'Sobrecarregado' }
  }
  if (RUNS_THE_ENTERPRISE.includes(row.role)) {
    return { tone: 'neutral', label: 'Gestão interna' }
  }
  if (row.activeProjects === 0) return { tone: 'amber', label: 'Sem projeto' }
  if (row.utilization < IDLE_UTILIZATION) {
    return { tone: 'amber', label: 'Lançando pouco' }
  }
  return { tone: 'green', label: 'Equilibrado' }
}

/** Committed, planned and logged, side by side, one row per person. */
export function CapacityTable({
  workload,
}: {
  workload: Loadable<MemberWorkload[]>
}) {
  return (
    <ListState
      query={workload}
      rows={workload.data ?? []}
      loadingLabel="Calculando a carga da equipe…"
      skeleton={<SkeletonTable columns={7} />}
      empty={
        <EmptyState
          title="Nenhum membro nesta gestão"
          description="Cadastre a diretoria e a equipe da gestão para acompanhar a capacidade."
        />
      }
    >
      {(rows) => (
        <Table headers={CAPACITY_TABLE_HEADERS}>
          {rows.map((row) => {
            const status = capacityLabel(row)

            return (
              <TableRow key={row.memberId}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-tinta-suave">
                  {MEMBER_ROLE_LABELS[row.role]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatHours(row.committedWeeklyHours)}/sem
                </TableCell>
                <TableCell
                  className={
                    row.overload > OVERLOAD_THRESHOLD
                      ? 'whitespace-nowrap text-ambar'
                      : 'whitespace-nowrap'
                  }
                >
                  {formatHours(row.allocatedWeeklyHours)}/sem
                </TableCell>
                <TableCell className="text-center">{row.activeProjects}</TableCell>
                <TableCell className="min-w-[160px]">
                  <ProgressBar
                    ratio={row.utilization}
                    tone={status.tone === 'amber' ? 'amber' : 'violet'}
                    value={
                      <span className="text-xs">{formatPercent(row.utilization)}</span>
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </Table>
      )}
    </ListState>
  )
}
