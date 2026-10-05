import { Badge } from "@/components/ui";
import { TIME_ENTRY_CATEGORY_TONES } from "@/domain/constants";
import type { IsoDate } from "@/domain/types";
import { formatDayMonth, formatHours, formatWeekday } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WeekGridProps } from "./types";

/**
 * The week at a glance, one row per project.
 *
 * The screen the whole system depends on: if logging an hour costs more than a
 * few seconds, nobody logs it and every report downstream is fiction. So the
 * week is a grid — the member sees the gaps and fills a cell by clicking it,
 * instead of opening a form and re-picking the project seven times.
 */
const WeekGrid: React.FC<WeekGridProps> = ({ days, rows, today, onCell }) => {
  const dayTotal = (date: IsoDate) =>
    rows.reduce((total, row) => total + (row.hoursByDate[date] ?? 0), 0);

  const weekTotal = rows.reduce((total, row) => total + row.total, 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-linha bg-papel-alto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-linha">
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold text-tinta-suave"
            >
              Atividade
            </th>
            {days.map((date) => (
              <th
                key={date}
                scope="col"
                className={cn(
                  "px-2 py-3 text-center text-xs font-semibold",
                  date === today ? "text-violeta" : "text-tinta-suave",
                )}
              >
                <span className="block">
                  {date === today ? "Hoje" : formatWeekday(date)}
                </span>
                <span className="block font-normal normal-case">
                  {formatDayMonth(date)}
                </span>
              </th>
            ))}
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-tinta-suave"
            >
              Total da semana
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-linha hover:bg-papel">
              <td className="px-4 py-2.5 align-middle">
                <p className="m-0 font-medium whitespace-nowrap">{row.label}</p>
                {/* On a non-project row the label already is the category. */}
                {row.detail !== row.label && (
                  <Badge tone={TIME_ENTRY_CATEGORY_TONES[row.category]}>
                    {row.detail}
                  </Badge>
                )}
              </td>

              {days.map((date) => {
                const hours = row.hoursByDate[date] ?? 0;
                return (
                  <td
                    key={date}
                    className="px-1 py-1.5 text-center align-middle"
                  >
                    <button
                      type="button"
                      onClick={() => onCell(row, date)}
                      aria-label={
                        hours > 0
                          ? `${formatHours(hours)} em ${row.label} no dia ${formatDayMonth(date)}. Adicionar mais horas`
                          : `Adicionar horas em ${row.label} no dia ${formatDayMonth(date)}`
                      }
                      title={
                        hours > 0
                          ? "Clique para somar mais horas neste dia"
                          : "Clique para lançar horas neste dia"
                      }
                      className={cn(
                        "group flex h-9 w-full items-center whitespace-nowrap justify-center gap-1 rounded-md border text-sm transition-colors",
                        hours > 0
                          ? "border-violeta-lav bg-violeta-lav font-semibold text-violeta hover:border-violeta"
                          : "border-dashed border-linha text-tinta-suave hover:border-violeta hover:text-violeta",
                      )}
                    >
                      {hours > 0 ? (
                        <>
                          {formatHours(hours)}
                          {/* Says, before the click, that the click adds. */}
                          <span
                            aria-hidden
                            className="grid size-4 place-items-center rounded-full bg-violeta text-[11px] leading-none text-papel-alto opacity-60 group-hover:opacity-100"
                          >
                            +
                          </span>
                        </>
                      ) : (
                        <span aria-hidden className="text-base leading-none">
                          +
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}

              <td className="px-4 py-2.5 text-right align-middle font-display font-bold whitespace-nowrap">
                {formatHours(row.total)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-papel">
            <td className="px-4 py-2.5 text-sm font-semibold text-tinta-suave">
              Total do dia
            </td>
            {days.map((date) => (
              <td
                key={date}
                className="px-2 py-2.5 text-center text-sm font-semibold"
              >
                {dayTotal(date) > 0
                  ? dayTotal(date).toLocaleString("pt-BR")
                  : "—"}
              </td>
            ))}
            <td className="px-4 py-2.5 text-right font-display font-bold whitespace-nowrap">
              {formatHours(weekTotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export { WeekGrid };
