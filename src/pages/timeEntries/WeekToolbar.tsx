import {
  Button,
  Card,
  ProgressBar,
  SelectField,
  nameOptions,
} from "@/components/ui";
import { formatDate, formatDayMonth, formatHours } from "@/lib/format";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { TimesheetPageState } from "./types";

type WeekToolbarProps = Pick<
  TimesheetPageState,
  | "weekStart"
  | "weekEnd"
  | "isCurrentWeek"
  | "goToWeek"
  | "goToToday"
  | "weekTotal"
  | "committed"
  | "seesEveryone"
  | "members"
  | "memberId"
  | "setMemberId"
>;

/** Which week is on screen, whose it is, and how far it is from the commitment. */
const WeekToolbar: React.FC<WeekToolbarProps> = (props) => {
  const hasGoal = props.committed > 0;
  const missing = Math.max(0, props.committed - props.weekTotal);

  return (
    <Card className="mb-5 p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="subtle"
            onClick={() => props.goToWeek(-1)}
            aria-label="Semana anterior"
            title="Semana anterior"
          >
            <ChevronLeftIcon size={15} />
          </Button>

          <div className="min-w-44 px-1 text-center">
            <p className="m-0 text-xs text-tinta-suave">
              {props.isCurrentWeek ? "Esta semana" : "Semana de"}
            </p>
            <p className="m-0 font-display text-base font-bold">
              {formatDayMonth(props.weekStart)} a {formatDate(props.weekEnd)}
            </p>
          </div>

          <Button
            variant="subtle"
            onClick={() => props.goToWeek(1)}
            aria-label="Próxima semana"
            title="Próxima semana"
          >
            <ChevronRightIcon size={15} />
          </Button>

          {!props.isCurrentWeek && (
            <Button variant="subtle" onClick={props.goToToday}>
              Voltar para esta semana
            </Button>
          )}
        </div>

        {props.seesEveryone && (
          <div className="min-w-55">
            <SelectField
              label="Ver horas de"
              value={props.memberId}
              onValueChange={(next) => props.setMemberId(next)}
              options={nameOptions(props.members)}
            />
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-linha pt-4">
        {hasGoal ? (
          <ProgressBar
            ratio={props.weekTotal / props.committed}
            tone={missing === 0 ? "green" : "violet"}
            label={
              <>
                <strong>{formatHours(props.weekTotal)}</strong> registradas de{" "}
                {formatHours(props.committed)} combinadas por semana
              </>
            }
            value={
              missing === 0
                ? "Meta da semana cumprida"
                : `Faltam ${formatHours(missing)}`
            }
          />
        ) : (
          <p className="m-0 text-base">
            <strong>{formatHours(props.weekTotal)}</strong> registradas nesta
            semana
          </p>
        )}
      </div>
    </Card>
  );
};

export { WeekToolbar };
