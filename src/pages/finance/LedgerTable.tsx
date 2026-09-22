import {
  Badge,
  Button,
  EmptyState,
  ListState,
  SkeletonTable,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import type { Tone } from '@/domain/constants'
import {
  DIRECTORATE_LABELS,
  FINANCE_CATEGORY_LABELS,
  FINANCE_KIND_TONES,
} from '@/domain/constants'
import type { FinanceEntry, IsoDate } from '@/domain/types'
import { formatDate, formatExactMoney } from '@/lib/format'
import { FINANCE_TABLE_HEADERS } from './constants'
import type { FinancePageState } from './types'

/** Open, overdue or settled — the three states a line can be read in. */
function settlementBadge(
  entry: FinanceEntry,
  today: IsoDate,
): { tone: Tone; label: string } {
  if (entry.paidAt) {
    return { tone: 'green', label: `Quitada em ${formatDate(entry.paidAt)}` }
  }
  if (entry.dueAt < today) return { tone: 'amber', label: 'Vencida' }
  return { tone: 'neutral', label: 'Em aberto' }
}

/** What settling this line would mean, said from the money's point of view. */
const settleLabel = (entry: FinanceEntry) => {
  if (entry.paidAt) return 'Reabrir'
  return entry.kind === 'receivable' ? 'Marcar recebida' : 'Marcar paga'
}

type LedgerTableProps = Pick<
  FinancePageState,
  | 'entries'
  | 'rows'
  | 'today'
  | 'editable'
  | 'settling'
  | 'toggleSettlement'
  | 'dialog'
  | 'memberName'
>

export function LedgerTable(props: LedgerTableProps) {
  return (
    <ListState
      query={props.entries}
      rows={props.rows}
      loadingLabel="Carregando lançamentos…"
      skeleton={<SkeletonTable columns={6} rows={6} />}
      empty={
        <EmptyState
          title="Nenhum lançamento"
          description="Registre o que entra e o que sai — parcela de contrato, mensalidade, premiação ou o coffee break de ontem — para o fluxo de caixa passar a existir."
          action={
            props.editable && (
              <Button onClick={() => props.dialog.openWith()}>
                Novo lançamento
              </Button>
            )
          }
        />
      }
    >
      {(rows) => (
        <Table headers={FINANCE_TABLE_HEADERS}>
          {rows.map((entry) => {
            const badge = settlementBadge(entry, props.today)

            return (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap text-tinta-suave">
                  {formatDate(entry.dueAt)}
                </TableCell>
                <TableCell className="font-medium">
                  {entry.description}
                  {/* Quem adiantou o dinheiro e onde está o papel: sem isso,
                      um reembolso vira conversa de memória no grupo. */}
                  {(entry.memberId || entry.receiptRef) && (
                    <span className="mt-0.5 block text-2xs font-normal text-tinta-suave">
                      {[
                        entry.memberId && `por ${props.memberName(entry.memberId)}`,
                        entry.receiptRef,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-tinta-suave">
                  {FINANCE_CATEGORY_LABELS[entry.category]}
                </TableCell>
                <TableCell className="text-tinta-suave">
                  {DIRECTORATE_LABELS[entry.directorate]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge tone={FINANCE_KIND_TONES[entry.kind]}>
                    {entry.kind === 'payable' ? '−' : '+'}{' '}
                    {formatExactMoney(entry.amountCents)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge tone={badge.tone}>{badge.label}</Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {props.editable && (
                    <button
                      type="button"
                      disabled={props.settling}
                      onClick={() => props.toggleSettlement(entry)}
                      className="rounded-md border border-linha px-2 py-1 text-sm text-tinta-suave hover:border-verde hover:text-verde disabled:opacity-55"
                    >
                      {settleLabel(entry)}
                    </button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </Table>
      )}
    </ListState>
  )
}
