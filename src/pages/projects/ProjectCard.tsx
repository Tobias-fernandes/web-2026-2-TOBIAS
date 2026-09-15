import { Badge } from '@/components/ui'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONES } from '@/domain/constants'
import type { Project, ProjectStatus } from '@/domain/types'
import { formatCurrency, formatDate, formatDueLabel } from '@/lib/format'

interface ProjectCardProps {
  project: Project
  clientName: string
  ownerName: string
  nextStatus: ProjectStatus | null
  moving: boolean
  onMove: (status: ProjectStatus) => void
}

export function ProjectCard({
  project,
  clientName,
  ownerName,
  nextStatus,
  moving,
  onMove,
}: ProjectCardProps) {
  return (
    <li className="rounded-[6px] border border-linha bg-papel p-3">
      <p className="m-0 font-semibold">{project.name}</p>
      <p className="m-0 mt-0.5 text-[0.82rem] text-tinta-suave">{clientName}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge tone={PROJECT_STATUS_TONES[project.status]}>{project.stage}</Badge>
        {project.status === 'inProgress' && (
          <Badge tone="neutral">{formatDueLabel(project.dueAt)}</Badge>
        )}
      </div>

      <dl className="mt-3 mb-0 grid grid-cols-2 gap-1 text-[0.78rem] text-tinta-suave">
        <div>
          <dt className="inline">Responsável: </dt>
          <dd className="m-0 inline text-tinta">{ownerName}</dd>
        </div>
        <div>
          <dt className="inline">Valor: </dt>
          <dd className="m-0 inline text-tinta">
            {formatCurrency(project.contractValue)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="inline">Prazo: </dt>
          <dd className="m-0 inline text-tinta">{formatDate(project.dueAt)}</dd>
        </div>
      </dl>

      {nextStatus && (
        <button
          type="button"
          disabled={moving}
          onClick={() => onMove(nextStatus)}
          className="mt-3 w-full rounded-[4px] border border-linha bg-papel-alto px-2 py-1.5 text-[0.8rem] text-tinta-suave hover:border-violeta hover:text-violeta disabled:opacity-55"
        >
          Mover para {PROJECT_STATUS_LABELS[nextStatus].toLowerCase()}
        </button>
      )}
    </li>
  )
}
