import {
  Button,
  Card,
  nameOptions,
  SelectField,
  type SelectOption,
} from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { EVENT_KIND_LABELS, EVENT_KIND_ORDER } from "@/domain/constants";
import type { EventKind } from "@/domain/types";
import type { CalendarPageState } from "./types";

type CalendarToolbarProps = Pick<
  CalendarPageState,
  | "monthLabel"
  | "isCurrentMonth"
  | "goToMonth"
  | "goToToday"
  | "monthTotal"
  | "filter"
  | "setFilter"
  | "clearFilter"
  | "filtering"
  | "workAreas"
>;

const ALL_AREAS_OPTION = { value: "", label: "Todas as diretorias" };

const KIND_FILTER_OPTIONS: SelectOption<"" | EventKind>[] = [
  { value: "", label: "Todos os tipos" },
  ...EVENT_KIND_ORDER.map((kind) => ({
    value: kind,
    label: EVENT_KIND_LABELS[kind],
  })),
];

/** Which month is on screen, how cheia it is, and what is being hidden. */
const CalendarToolbar: React.FC<CalendarToolbarProps> = (props) => {
  return (
    <Card className="mb-5 p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-2">
          <Button
            variant="subtle"
            aria-label="Mês anterior"
            onClick={() => props.goToMonth(-1)}
          >
            <ChevronLeftIcon size={15} />
          </Button>

          <div className="px-1">
            <p className="m-0 font-display text-base font-bold">
              {props.monthLabel}
            </p>
            <p className="m-0 text-xs text-tinta-suave">
              {props.isCurrentMonth ? "Mês atual" : "Outro mês"} ·{" "}
              {props.monthTotal === 1
                ? "1 compromisso"
                : `${props.monthTotal} compromissos`}
              {props.filtering && " com os filtros aplicados"}
            </p>
          </div>

          <Button
            variant="subtle"
            aria-label="Próximo mês"
            onClick={() => props.goToMonth(1)}
          >
            <ChevronRightIcon size={15} />
          </Button>

          {!props.isCurrentMonth && (
            <Button variant="subtle" onClick={props.goToToday}>
              Hoje
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[190px]">
            <SelectField
              label="Diretoria"
              value={props.filter.workAreaId}
              options={[ALL_AREAS_OPTION, ...nameOptions(props.workAreas)]}
              onValueChange={(next) =>
                props.setFilter({
                  ...props.filter,
                  workAreaId: next,
                })
              }
            />
          </div>

          <div className="min-w-[180px]">
            <SelectField
              label="Tipo"
              value={props.filter.kind}
              options={KIND_FILTER_OPTIONS}
              onValueChange={(next) =>
                props.setFilter({
                  ...props.filter,
                  kind: next,
                })
              }
            />
          </div>

          {props.filtering && (
            <Button variant="subtle" onClick={props.clearFilter}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export { CalendarToolbar };
