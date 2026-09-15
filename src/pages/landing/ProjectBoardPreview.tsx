import { Badge } from '@/components/ui'
import {
  PROJECT_BOARD_COLUMNS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
} from '@/domain/constants'
import { formatHours } from '@/lib/format'
import { SEED_PROJECTS, SEED_TIME_ENTRIES } from '@/services/mock'

/**
 * Board illustration shown in the landing hero.
 *
 * Reads the demo data directly instead of going through the query hooks: the
 * public page is unauthenticated and must not fire API calls.
 */
export function ProjectBoardPreview() {
  const totalHours = SEED_TIME_ENTRIES.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div
      aria-label="Exemplo do painel de projetos"
      className="rounded-lg border border-linha bg-papel-alto p-4"
    >
      <div className="flex items-baseline justify-between border-b border-linha px-1 pb-3 text-[0.82rem] text-tinta-suave">
        <span>Painel de projetos — gestão 2026</span>
        <span>{formatHours(totalHours)} lançadas</span>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {PROJECT_BOARD_COLUMNS.map((status) => (
          <div key={status}>
            <h3 className="mb-2 font-sans text-[0.72rem] font-semibold text-tinta-suave">
              {PROJECT_STATUS_LABELS[status]}
            </h3>
            {SEED_PROJECTS.filter((project) => project.status === status).map(
              (project) => (
                <div
                  key={project.id}
                  className="mb-2 rounded-[5px] border border-linha bg-papel p-2.5 text-[0.78rem] leading-tight"
                >
                  <b className="mb-1.5 block font-semibold">{project.name}</b>
                  <Badge tone={PROJECT_STATUS_TONES[project.status]}>
                    {project.stage}
                  </Badge>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
