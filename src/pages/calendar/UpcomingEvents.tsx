import { Card, CardTitle } from '@/components/ui'
import { EVENT_KIND_LABELS } from '@/domain/constants'
import { formatDayMonth, formatTimeRange, formatWeekday } from '@/lib/format'
import type { CalendarPageState } from './types'

type UpcomingEventsProps = Pick<
  CalendarPageState,
  'upcoming' | 'selectDate' | 'isCurrentMonth'
>

/**
 * What is still to come in the month on screen.
 *
 * Only this month, because only this month was read — a card that promised "the
 * next commitments" and stopped at the 30th would be lying by omission every
 * time someone looked at it late in the month.
 */
export function UpcomingEvents({
  upcoming,
  selectDate,
  isCurrentMonth,
}: UpcomingEventsProps) {
  return (
    <Card>
      <CardTitle>A seguir neste mês</CardTitle>

      {upcoming.length === 0 ? (
        <p className="m-0 text-base leading-relaxed text-tinta-suave">
          {isCurrentMonth
            ? 'Nada mais marcado até o fim do mês.'
            : 'Este mês já passou — não há nada pela frente nele.'}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {upcoming.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => selectDate(event.startsAt)}
                className="flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-papel"
              >
                <span className="w-16 shrink-0 font-display text-xs font-bold text-violeta">
                  {formatWeekday(event.startsAt)} {formatDayMonth(event.startsAt)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{event.title}</span>
                  <span className="block text-xs text-tinta-suave">
                    {formatTimeRange(event.startTime, event.endTime)} ·{' '}
                    {EVENT_KIND_LABELS[event.kind]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
