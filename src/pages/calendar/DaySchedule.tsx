import { Button, Card } from '@/components/ui'
import { formatDayMonthLong, formatWeekdayLong } from '@/lib/format'
import { EventCard } from './EventCard'
import type { CalendarPageState } from './types'

type DayScheduleProps = Pick<
  CalendarPageState,
  | 'selectedDay'
  | 'editable'
  | 'openDialog'
  | 'editEvent'
  | 'toggleCancelled'
  | 'removeEvent'
  | 'saving'
  | 'projectName'
  | 'memberName'
>

/**
 * The day picked on the grid, in full.
 *
 * The grid can only afford a title per commitment; everything that makes one
 * actionable — where it is, what the pauta is, who to ask — lives here, beside
 * it, instead of behind a second click into a dialog.
 */
export function DaySchedule({
  selectedDay: day,
  editable,
  openDialog,
  editEvent,
  toggleCancelled,
  removeEvent,
  saving,
  projectName,
  memberName,
}: DayScheduleProps) {
  if (!day) return null

  return (
    <Card>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="m-0 font-display text-md font-bold">
            {formatDayMonthLong(day.date)}
          </h2>
          <p className="m-0 text-xs text-tinta-suave">
            {formatWeekdayLong(day.date)}
            {day.isToday && ' · hoje'}
          </p>
        </div>

        {editable && (
          <Button
            variant="subtle"
            className="shrink-0"
            onClick={() => openDialog(day.date)}
          >
            Agendar
          </Button>
        )}
      </div>

      {day.events.length === 0 ? (
        <p className="m-0 text-base leading-relaxed text-tinta-suave">
          Nada marcado para este dia.
          {editable && ' Use "Agendar" para abrir um compromisso.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {day.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              editable={editable}
              saving={saving}
              projectName={projectName}
              memberName={memberName}
              onEdit={editEvent}
              onToggleCancelled={toggleCancelled}
              onRemove={removeEvent}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
