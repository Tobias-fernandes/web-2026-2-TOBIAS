import { Badge, ProgressBar } from "@/components/ui";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
} from "@/domain/constants";
import type { ProjectStatus } from "@/domain/types";
import {
  formatDate,
  formatDueLabel,
  formatHours,
  formatMoney,
} from "@/lib/format";
import { PROJECT_BOARD_COLUMNS } from "@/domain/constants";
import { BUDGET_ALERT_USAGE } from "./constants";
import type { ProjectCardProps } from "./types";

/** Next column on the board; the last one has nowhere left to advance. */
function nextStatus(status: ProjectStatus): ProjectStatus | null {
  const index = PROJECT_BOARD_COLUMNS.indexOf(status);
  return index >= 0 && index < PROJECT_BOARD_COLUMNS.length - 1
    ? PROJECT_BOARD_COLUMNS[index + 1]
    : null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  clientName,
  ownerName,
  margin,
  editable,
  moving,
  onMove,
}) => {
  const overBudget = (margin?.hoursUsage ?? 0) > BUDGET_ALERT_USAGE;
  const next = editable ? nextStatus(project.status) : null;

  return (
    <li className="rounded-[6px] border border-linha bg-papel p-3">
      <p className="m-0 font-semibold">{project.name}</p>
      <p className="m-0 mt-0.5 text-sm text-tinta-suave">{clientName}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge tone={PROJECT_STATUS_TONES[project.status]}>
          {project.stage}
        </Badge>
        {project.status !== "delivered" && (
          <Badge tone="neutral">{formatDueLabel(project.dueAt)}</Badge>
        )}
        {project.npsScore !== null && (
          <Badge tone="green">NPS {project.npsScore}</Badge>
        )}
      </div>

      <dl className="mt-3 mb-0 grid grid-cols-2 gap-1 text-xs text-tinta-suave">
        <div>
          <dt className="inline">Gerente: </dt>
          <dd className="m-0 inline text-tinta">{ownerName}</dd>
        </div>
        <div>
          <dt className="inline">Valor: </dt>
          <dd className="m-0 inline text-tinta">
            {formatMoney(project.contractValueCents)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="inline">Prazo: </dt>
          <dd className="m-0 inline text-tinta">{formatDate(project.dueAt)}</dd>
        </div>
      </dl>

      {margin && (
        <div className="mt-3">
          <ProgressBar
            ratio={margin.hoursUsage}
            tone={overBudget ? "amber" : "violet"}
            label={<span className="text-xs">Orçamento de horas</span>}
            value={
              <span className="text-xs">
                {formatHours(margin.loggedHours)} de{" "}
                {formatHours(margin.estimatedHours)}
              </span>
            }
          />
          {margin.realizedHourlyRateCents !== null && (
            <p className="mt-1.5 mb-0 text-xs text-tinta-suave">
              Hora real:{" "}
              <strong className={overBudget ? "text-ambar" : "text-tinta"}>
                {formatMoney(margin.realizedHourlyRateCents)}
              </strong>{" "}
              · orçada {formatMoney(margin.estimatedHourlyRateCents)}
            </p>
          )}
        </div>
      )}

      {next && (
        <button
          type="button"
          disabled={moving}
          onClick={() => onMove(next)}
          className="mt-3 w-full rounded-sm border border-linha bg-papel-alto px-2 py-1.5 text-sm text-tinta-suave hover:border-violeta hover:text-violeta disabled:opacity-55"
        >
          Mover para {PROJECT_STATUS_LABELS[next].toLowerCase()}
        </button>
      )}
    </li>
  );
};

export { ProjectCard };
