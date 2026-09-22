import {
  ListState,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import type { Loadable } from '@/components/ui'
import { MEMBER_ROLE_LABELS, OVERLOAD_THRESHOLD } from '@/domain/constants'
import type { MemberWorkload } from '@/domain/types'
import { formatHours, formatPercent } from '@/lib/format'
import { NO_ENTRIES, WORKLOAD_HEADERS } from './constants'

/** What each person committed to, was planned for, and actually logged. */
export function WorkloadTable({
  workload,
}: {
  workload: Loadable<MemberWorkload[]>
}) {
  return (
    <ListState
      query={workload}
      rows={workload.data ?? []}
      skeleton={<SkeletonTable columns={7} />}
      empty={NO_ENTRIES}
    >
      {(rows) => (
        <Table headers={WORKLOAD_HEADERS}>
          {rows.map((row) => (
            <TableRow key={row.memberId}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-tinta-suave">
                {MEMBER_ROLE_LABELS[row.role]}
              </TableCell>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatHours(row.committedWeeklyHours)}/sem
              </TableCell>
              <TableCell
                className={
                  row.overload > OVERLOAD_THRESHOLD
                    ? 'whitespace-nowrap text-ambar'
                    : 'whitespace-nowrap text-tinta-suave'
                }
              >
                {formatHours(row.allocatedWeeklyHours)}/sem
              </TableCell>
              <TableCell className="whitespace-nowrap font-display font-bold">
                {formatHours(row.loggedHours)}
              </TableCell>
              <TableCell className="text-tinta-suave">
                {formatPercent(row.utilization)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </ListState>
  )
}
