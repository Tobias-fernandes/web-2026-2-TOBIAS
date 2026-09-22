import { useQuery } from '@tanstack/react-query'
import { dataLayer, type TimeEntryFilter } from '@/services'
import { createEntityQueries } from './createEntityQueries'
import { queryKeys } from './queryKeys'

const timeEntries = createEntityQueries(queryKeys.timeEntries, dataLayer.timeEntries)

export const useCreateTimeEntry = timeEntries.useCreate
export const useUpdateTimeEntry = timeEntries.useUpdate
export const useDeleteTimeEntry = timeEntries.useRemove

/** Always filtered: the page's date range and pickers are part of the key. */
export function useTimeEntries(filter: TimeEntryFilter = {}) {
  return useQuery({
    queryKey: queryKeys.timeEntries.filtered(filter),
    queryFn: () => dataLayer.timeEntries.listBy(filter),
    // Keeps the previous rows on screen while a new filter loads, so the table
    // does not flash empty on every keystroke or date change.
    placeholderData: (previous) => previous,
  })
}
