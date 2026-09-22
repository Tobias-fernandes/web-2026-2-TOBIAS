import { BADGE_TONE_CLASSES } from "@/components/ui";
import { EVENT_KIND_TONES } from "@/domain/constants";
import { isScheduledEvent } from "@/domain/rules";
import type {} from "@/domain/types";
import { DAYS_IN_WEEK } from "@/lib/date";
import { formatDayMonthLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  isDerivedEvent,
  MAX_CHIPS_PER_DAY,
  WEEKDAY_HEADERS,
} from "./constants";
import type { CalendarDay } from "./types";
import type { MonthGridProps } from "./types";

/** The cells arrive as one flat run; the weeks are the rows they are drawn on. */
function toWeeks(days: CalendarDay[]): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let index = 0; index < days.length; index += DAYS_IN_WEEK) {
    weeks.push(days.slice(index, index + DAYS_IN_WEEK));
  }
  return weeks;
}

/** Sentence a screen reader hears instead of counting the chips in a cell. */
function describeDay(day: CalendarDay): string {
  const total = day.events.length;
  const date = formatDayMonthLong(day.date);
  if (total === 0) return `${date}, sem compromissos`;
  return `${date}, ${total === 1 ? "1 compromisso" : `${total} compromissos`}`;
}

/**
 * The month, one cell per day.
 *
 * The cell is a single button and the chips inside it are not clickable: a
 * calendar that packs three separate targets into a 100-pixel square is a
 * calendar you open the wrong thing on. Picking a day fills the panel beside
 * the grid, which is where a commitment can actually be read and changed.
 */
const MonthGrid: React.FC<MonthGridProps> = ({ days, onSelect }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-linha bg-papel-alto">
      <table className="w-full min-w-[640px] table-fixed border-collapse">
        <caption className="sr-only">
          Compromissos do mês, uma coluna por dia da semana.
        </caption>

        <thead>
          <tr className="border-b border-linha">
            {WEEKDAY_HEADERS.map((weekday) => (
              <th
                key={weekday}
                scope="col"
                className="px-2 py-2.5 text-center text-2xs font-semibold tracking-[0.06em] text-tinta-suave uppercase"
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {toWeeks(days).map((week) => (
            <tr key={week[0].date}>
              {week.map((day) => {
                const hidden = day.events.length - MAX_CHIPS_PER_DAY;

                return (
                  <td key={day.date} className="p-0 align-top">
                    <button
                      type="button"
                      onClick={() => onSelect(day.date)}
                      aria-label={describeDay(day)}
                      aria-pressed={day.isSelected}
                      className={cn(
                        "flex h-full min-h-[108px] w-full flex-col items-stretch gap-1 border-r border-b border-linha p-1.5 text-left transition-colors",
                        day.isSelected
                          ? "bg-violeta-lav"
                          : day.inMonth
                            ? "bg-papel-alto hover:bg-papel"
                            : "bg-papel/60 hover:bg-papel",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-6 min-w-6 shrink-0 items-center justify-center self-start rounded-full px-1 font-display text-xs font-bold",
                          day.isToday && "bg-violeta-forte text-white",
                          !day.isToday && !day.inMonth && "text-tinta-suave/70",
                        )}
                      >
                        {Number(day.date.slice(8))}
                      </span>

                      {day.events.slice(0, MAX_CHIPS_PER_DAY).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            "block truncate rounded-[4px] border px-1.5 py-0.5 text-2xs font-medium",
                            // Tracejado é o que diz "isto não mora aqui": a data
                            // pertence ao projeto e aqui ela só é desenhada.
                            isDerivedEvent(event)
                              ? "border-dashed border-ambar text-ambar"
                              : BADGE_TONE_CLASSES[
                                  EVENT_KIND_TONES[event.kind]
                                ],
                            !isScheduledEvent(event) &&
                              "line-through opacity-60",
                            !day.inMonth && "opacity-70",
                          )}
                        >
                          {!event.allDay && event.startTime && (
                            <span className="font-semibold">
                              {event.startTime}{" "}
                            </span>
                          )}
                          {event.title}
                        </span>
                      ))}

                      {hidden > 0 && (
                        <span className="px-1 text-2xs font-semibold text-tinta-suave">
                          +{hidden}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { MonthGrid };
