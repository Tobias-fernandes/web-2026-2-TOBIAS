import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import {
  describeAudience,
  EVENT_KIND_LABELS,
  EVENT_KIND_TONES,
} from "@/domain/constants";
import { isScheduledEvent } from "@/domain/rules";
import type {} from "@/domain/types";
import { formatDate, formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import { isDerivedEvent } from "./constants";
import type { EventCardProps } from "./types";

const ACTION =
  "rounded-md px-2 py-1 text-sm text-tinta-suave transition-colors hover:text-tinta disabled:opacity-55";

/** A field of the commitment, printed only when it was filled in. */
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <dt className="shrink-0 text-tinta-suave">{label}</dt>
      <dd className="m-0 min-w-0 break-words">{children}</dd>
    </div>
  );
}

/**
 * One commitment, in full: where it is, what the pauta is, who to ask.
 *
 * Deliveries synthesised from a project's `dueAt` arrive here as ordinary
 * events. They are read-only — there is no record behind them to change — so
 * they trade the action row for a way into the board that owns the date.
 */
const EventCard: React.FC<EventCardProps> = ({
  event,
  editable,
  saving,
  projectName,
  memberName,
  onEdit,
  onToggleCancelled,
  onRemove,
}) => {
  const active = isScheduledEvent(event);
  const derived = isDerivedEvent(event);
  const isMultiDay = event.startsAt !== event.endsAt;

  return (
    <article
      className={cn(
        "rounded-lg border bg-papel p-3.5",
        derived ? "border-dashed border-ambar/60" : "border-linha",
        !active && "opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "m-0 font-display font-bold",
              !active && "line-through",
            )}
          >
            {event.title}
          </p>
          <p className="m-0 text-xs text-tinta-suave">
            {formatTimeRange(event.startTime, event.endTime)} ·{" "}
            {describeAudience(event.audience, event.directorate)}
          </p>
        </div>

        <Badge tone={EVENT_KIND_TONES[event.kind]} className="shrink-0">
          {EVENT_KIND_LABELS[event.kind]}
        </Badge>
      </div>

      {!active && (
        <p className="mt-2 mb-0 text-sm font-semibold text-vermelho">
          Cancelado
        </p>
      )}

      {event.description && (
        <p className="mt-2.5 mb-0 text-base leading-relaxed text-tinta-suave">
          {event.description}
        </p>
      )}

      <dl className="m-0 mt-3 flex flex-col gap-1">
        {isMultiDay && (
          <Detail label="Período">
            {formatDate(event.startsAt)} a {formatDate(event.endsAt)}
          </Detail>
        )}

        {event.location && <Detail label="Local">{event.location}</Detail>}

        {event.onlineUrl && (
          <Detail label="Link">
            <a
              href={event.onlineUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-violeta"
            >
              Entrar na reunião
            </a>
          </Detail>
        )}

        {event.projectId && (
          <Detail label="Projeto">{projectName(event.projectId)}</Detail>
        )}

        {!derived && (
          <Detail label="Marcado por">{memberName(event.createdBy)}</Detail>
        )}
      </dl>

      {derived ? (
        <Link
          to={ROUTES.app.projects}
          className="mt-3 inline-block text-sm text-violeta no-underline"
        >
          Abrir no quadro de projetos
        </Link>
      ) : (
        editable && (
          <div className="mt-3 flex flex-wrap gap-1 border-t border-linha pt-2.5">
            <button
              type="button"
              className={ACTION}
              onClick={() => onEdit(event)}
            >
              Editar
            </button>

            <button
              type="button"
              disabled={saving}
              className={cn(ACTION, "hover:text-ambar")}
              onClick={() => onToggleCancelled(event)}
            >
              {active ? "Cancelar" : "Reativar"}
            </button>

            {/* Excluir é para o que nunca deveria ter sido criado; o que foi
                desmarcado é cancelado, para quem tinha reservado a noite ver. */}
            <button
              type="button"
              disabled={saving}
              title="Apaga o registro. Para avisar que não acontece mais, use Cancelar."
              className={cn(ACTION, "hover:text-vermelho")}
              onClick={() => onRemove(event.id)}
            >
              Excluir
            </button>
          </div>
        )
      )}
    </article>
  );
};

export { EventCard };
