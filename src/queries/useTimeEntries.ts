import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateInput, ID, TimeEntry } from '@/domain/types'
import { dataLayer, type TimeEntryFilter } from '@/services'
import { queryKeys } from './queryKeys'

export function useTimeEntries(filter: TimeEntryFilter = {}) {
  return useQuery({
    queryKey: queryKeys.timeEntries.filtered(filter),
    queryFn: () => dataLayer.timeEntries.listBy(filter),
    // Keeps the previous rows on screen while a new filter loads, so the table
    // does not flash empty on every keystroke or date change.
    placeholderData: (previous) => previous,
  })
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInput<TimeEntry>) =>
      dataLayer.timeEntries.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: ID) => dataLayer.timeEntries.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
