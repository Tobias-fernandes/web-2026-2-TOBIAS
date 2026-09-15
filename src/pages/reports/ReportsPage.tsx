import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import {
  Button,
  Card,
  CardTitle,
  Spinner,
  Table,
  TableCell,
  TableRow,
  TextField,
} from '@/components/ui'
import { MEMBER_ROLE_LABELS } from '@/domain/constants'
import { formatCurrency, formatHours, formatPercent } from '@/lib/format'
import { useDashboardMetrics, useHoursByMember, useHoursByProject } from '@/queries'
import {
  EMPTY_REPORT_PERIOD,
  MEMBER_HOURS_HEADERS,
  PROJECT_HOURS_HEADERS,
} from './constants'
import type { ReportPeriodState } from './types'

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriodState>(EMPTY_REPORT_PERIOD)

  const query = { from: period.from || undefined, to: period.to || undefined }

  const metrics = useDashboardMetrics(query)
  const byMember = useHoursByMember(query)
  const byProject = useHoursByProject(query)

  const isLoading = metrics.isPending || byMember.isPending || byProject.isPending

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Faturamento, projetos e horas por membro já somados para a prestação de contas da gestão."
        action={
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir / salvar PDF
          </Button>
        }
      />

      <Card className="mb-5 p-4 print:hidden">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <TextField
            label="Início do período"
            type="date"
            value={period.from}
            onChange={(event) => setPeriod({ ...period, from: event.target.value })}
          />
          <TextField
            label="Fim do período"
            type="date"
            value={period.to}
            onChange={(event) => setPeriod({ ...period, to: event.target.value })}
          />
          <Button variant="subtle" onClick={() => setPeriod(EMPTY_REPORT_PERIOD)}>
            Toda a gestão
          </Button>
        </div>
      </Card>

      {isLoading && <Spinner label="Consolidando números…" />}

      {metrics.data && (
        <Card className="mb-5">
          <CardTitle>Resumo da gestão</CardTitle>
          <dl className="m-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Faturamento contratado',
                value: formatCurrency(metrics.data.contractedRevenue),
              },
              {
                label: 'Faturamento realizado',
                value: formatCurrency(metrics.data.realizedRevenue),
              },
              {
                label: 'Projetos entregues',
                value: String(metrics.data.projectsDelivered),
              },
              {
                label: 'Horas lançadas',
                value: formatHours(metrics.data.loggedHours),
              },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[0.76rem] font-semibold tracking-wide text-tinta-suave uppercase">
                  {item.label}
                </dt>
                <dd className="m-0 mt-1 font-display text-xl font-bold">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-base font-bold">Horas por membro</h2>
          {byMember.data && byMember.data.length > 0 ? (
            <Table headers={MEMBER_HOURS_HEADERS}>
              {byMember.data.map((row) => (
                <TableRow key={row.memberId}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-tinta-suave">
                    {MEMBER_ROLE_LABELS[row.role]}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-display font-bold">
                    {formatHours(row.hours)}
                  </TableCell>
                  <TableCell className="text-tinta-suave">
                    {formatPercent(row.utilization)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            !isLoading && (
              <p className="text-sm text-tinta-suave">
                Sem lançamentos no período selecionado.
              </p>
            )
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-base font-bold">Horas por projeto</h2>
          {byProject.data && byProject.data.length > 0 ? (
            <Table headers={PROJECT_HOURS_HEADERS}>
              {byProject.data.map((row) => {
                const consumption =
                  row.estimatedHours > 0 ? row.hours / row.estimatedHours : 0
                return (
                  <TableRow key={row.projectId}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="whitespace-nowrap font-display font-bold">
                      {formatHours(row.hours)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-tinta-suave">
                      {formatHours(row.estimatedHours)}
                    </TableCell>
                    <TableCell
                      className={consumption > 1 ? 'text-ambar' : 'text-tinta-suave'}
                    >
                      {formatPercent(consumption)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </Table>
          ) : (
            !isLoading && (
              <p className="text-sm text-tinta-suave">
                Sem lançamentos no período selecionado.
              </p>
            )
          )}
        </div>
      </div>
    </>
  )
}
