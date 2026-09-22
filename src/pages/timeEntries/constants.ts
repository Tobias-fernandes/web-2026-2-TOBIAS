import { todayIso } from '@/lib/date'
import type { TimeEntryFormState } from './types'

/** Built per open, so the date is today's rather than the date of the first load. */
export const buildEmptyTimeEntryForm = (): TimeEntryFormState => ({
  memberId: '',
  category: 'project',
  projectId: '',
  date: todayIso(),
  hours: '',
  description: '',
})

/** Smallest increment accepted when logging hours. */
export const HOURS_STEP = 0.5

export const WEEK_ENTRIES_HEADERS = [
  'Data',
  'Tipo',
  'Projeto',
  'Descrição',
  'Horas',
  '',
]

/** Shown where an entry has no project, because its hours are not billable. */
export const NO_PROJECT = '—'
