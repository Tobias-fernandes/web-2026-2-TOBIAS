import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Badge, Card, CardTitle, EmptyState, Spinner } from '@/components/ui'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONES } from '@/domain/constants'
import type { ProjectStatus } from '@/domain/types'
import {
  daysUntil,
  formatCurrency,
  formatDueLabel,
  formatHours,
  formatPercent,
} from '@/lib/format'
import { useDashboardMetrics, useHoursByMember, useProjects } from '@/queries'
import { useCurrentUser } from '@/stores/auth'
import { HOURS_CHART_LIMIT, URGENT_DUE_DAYS } from './constants'
import { MetricCard } from './MetricCard'

export function DashboardPage() {
  const user = useCurrentUser()

  const metrics = useDashboardMetrics()
  const projects = useProjects()
  const hoursByMember = useHoursByMember()

  const inProgress = (projects.data ?? [])
    .filter((project) => project.status === 'inProgress')
    .sort((a, b) => daysUntil(a.dueAt) - daysUntil(b.dueAt))

  return (
    <>
      <PageHeader
        title={`Olá, ${user?.name.split(' ')[0] ?? 'membro'}`}
        description="Situação da gestão em números, prazos próximos e distribuição de horas da equipe."
      />

      {metrics.isPending && <Spinner />}
      {metrics.isError && (
        <p className="text-sm text-ambar">{metrics.error.message}</p>
      )}

      {metrics.data && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Projetos em execução"
            value={String(metrics.data.projectsInProgress)}
            hint={`${metrics.data.projectsProspecting} em prospecção`}
          />
          <MetricCard
            label="Horas lançadas"
            value={formatHours(metrics.data.loggedHours)}
            hint={`${metrics.data.activeMembers} membros ativos`}
          />
          <MetricCard
            label="Faturamento contratado"
            value={formatCurrency(metrics.data.contractedRevenue)}
            hint={`${formatCurrency(metrics.data.realizedRevenue)} já entregue`}
          />
          <MetricCard
            label="Clientes ativos"
            value={String(metrics.data.activeClients)}
            hint={`${metrics.data.projectsDelivered} projetos entregues`}
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Card>
          <CardTitle
            action={
              <Link
                to="/app/projetos"
                className="text-[0.85rem] text-violeta no-underline"
              >
                Ver painel
              </Link>
            }
          >
            Prazos mais próximos
          </CardTitle>

          {projects.isPending && <Spinner />}
          {!projects.isPending && inProgress.length === 0 && (
            <EmptyState
              title="Nenhum projeto em execução"
              description="Assim que um contrato for movido para execução, ele aparece aqui ordenado por prazo."
            />
          )}

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {inProgress.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[5px] border border-linha bg-papel px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="m-0 text-[0.92rem] font-semibold">{project.name}</p>
                  <p className="m-0 text-[0.8rem] text-tinta-suave">
                    {project.stage}
                  </p>
                </div>
                <Badge
                  tone={
                    daysUntil(project.dueAt) <= URGENT_DUE_DAYS ? 'amber' : 'neutral'
                  }
                >
                  {formatDueLabel(project.dueAt)}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle
            action={
              <Link
                to="/app/relatorios"
                className="text-[0.85rem] text-violeta no-underline"
              >
                Relatórios
              </Link>
            }
          >
            Horas por membro
          </CardTitle>

          {hoursByMember.isPending && <Spinner />}

          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {(hoursByMember.data ?? []).slice(0, HOURS_CHART_LIMIT).map((row) => (
              <li key={row.memberId}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[0.88rem]">
                  <span className="truncate">{row.name}</span>
                  <span className="shrink-0 text-tinta-suave">
                    {formatHours(row.hours)}
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-papel"
                  role="img"
                  aria-label={`${formatPercent(row.utilization)} da carga pactuada`}
                >
                  <div
                    className="h-full rounded-full bg-violeta"
                    style={{
                      width: `${Math.min(100, Math.round(row.utilization * 100))}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 mb-0 text-[0.78rem] text-tinta-suave">
            A barra compara as horas lançadas com a carga semanal pactuada por cada
            membro.
          </p>
        </Card>
      </div>

      <Card className="mt-5">
        <CardTitle>Distribuição dos contratos</CardTitle>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((status) => (
            <span
              key={status}
              className="flex items-center gap-2 rounded-[4px] border border-linha px-3 py-1.5 text-[0.85rem]"
            >
              <Badge tone={PROJECT_STATUS_TONES[status]}>
                {PROJECT_STATUS_LABELS[status]}
              </Badge>
              <strong className="font-display">
                {(projects.data ?? []).filter((p) => p.status === status).length}
              </strong>
            </span>
          ))}
        </div>
      </Card>
    </>
  )
}
