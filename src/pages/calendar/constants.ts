import type { CalendarEvent } from '@/domain/types'
import { todayIso } from '@/lib/date'
import type { CalendarFilterState, EventFormState } from './types'

/**
 * Prefix of the commitments the calendar builds itself from project due dates.
 *
 * They travel through the screen as ordinary events — same filter, same sort,
 * same cell — and this is the one thing that tells them apart: they have no
 * record behind them, so nothing here may offer to edit or cancel one.
 */
export const DERIVED_ID_PREFIX = 'entrega:'

export const isDerivedEvent = (event: CalendarEvent): boolean =>
  event.id.startsWith(DERIVED_ID_PREFIX)

/** Evening, because that is when a junior enterprise meets. */
export const DEFAULT_START_TIME = '19:00'
export const DEFAULT_END_TIME = '20:30'

/** Built per open, so the date is today's rather than the day of the first load. */
export const buildEmptyEventForm = (): EventFormState => ({
  title: '',
  kind: 'meeting',
  directorate: 'presidency',
  audience: 'enterprise',
  startsAt: todayIso(),
  endsAt: todayIso(),
  allDay: false,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  location: '',
  onlineUrl: '',
  projectId: '',
  description: '',
})

export const EMPTY_CALENDAR_FILTER: CalendarFilterState = {
  directorate: '',
  kind: '',
}

/** Monday first, matching `startOfWeek` and the timesheet's grid. */
export const WEEKDAY_HEADERS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

/** Chips a day cell shows before the rest collapse into a count. */
export const MAX_CHIPS_PER_DAY = 3

/** How far ahead the "a seguir" list looks inside the month on screen. */
export const UPCOMING_LIMIT = 4
