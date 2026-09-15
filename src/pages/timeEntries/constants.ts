import type { TimeEntryFilterState } from './types'

export const EMPTY_TIME_ENTRY_FILTER: TimeEntryFilterState = {
  memberId: '',
  projectId: '',
  from: '',
  to: '',
}

/** Smallest increment accepted when logging hours. */
export const HOURS_STEP = 0.5
