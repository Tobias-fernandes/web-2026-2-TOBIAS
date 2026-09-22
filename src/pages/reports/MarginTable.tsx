import {
  ListState,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import type { Loadable } from '@/components/ui'
import type { ProjectMargin } from '@/domain/types'
import { formatHours, formatMoney, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { MARGIN_HEADERS, NO_ENTRIES } from './constants'

/** What each contract was worth against the hours it really cost. */
export function MarginTable({ margins }: { margins: Loadable<ProjectMargin[]> }) {
  return (
    <>
      <h2 className="mt-10 mb-2 font-display text-lg font-bold">
        Margem por projeto
      </h2>
      <p className="mt-0 mb-5 max-w-[70ch] text-base leading-relaxed text-tinta-suave">
        O contrato dividido pelas horas que ele realmente consumiu. É o número que
        mostra que um projeto de R$ 4.800 entregue em 320 horas foi vendido a R$ 15
        a hora — e o que deveria mudar a próxima proposta. Conta todas as horas do
        contrato, não só as do período filtrado acima.
      </p>

      <ListState
        query={margins}
        rows={margins.data ?? []}
        skeleton={<SkeletonTable columns={8} />}
        empty={NO_ENTRIES}
      >
        {(rows) => (
          <Table headers={MARGIN_HEADERS}>
            {rows.map((row) => {
              // Over the budget is the case the board has to see first.
              const overBudget = row.hoursUsage > 1

              return (
                <TableRow key={row.projectId}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-tinta-suave">{row.clientName}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatMoney(row.contractValueCents)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-tinta-suave">
                    {formatHours(row.estimatedHours)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-display font-bold">
                    {formatHours(row.loggedHours)}
                  </TableCell>
                  <TableCell className={overBudget ? 'text-ambar' : 'text-tinta-suave'}>
                    {formatPercent(row.hoursUsage)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-tinta-suave">
                    {formatMoney(row.estimatedHourlyRateCents)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'whitespace-nowrap font-display font-bold',
                      overBudget && 'text-ambar',
                    )}
                  >
                    {row.realizedHourlyRateCents !== null
                      ? formatMoney(row.realizedHourlyRateCents)
                      : '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
        )}
      </ListState>
    </>
  )
}
