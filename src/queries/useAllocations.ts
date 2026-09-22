import { useQuery } from '@tanstack/react-query'
import { dataLayer, type AllocationFilter } from '@/services'
import { createEntityQueries } from './createEntityQueries'
import { queryKeys } from './queryKeys'

const allocations = createEntityQueries(queryKeys.allocations, dataLayer.allocations)

export const useCreateAllocation = allocations.useCreate
export const useUpdateAllocation = allocations.useUpdate
export const useRemoveAllocation = allocations.useRemove

export function useAllocations(filter: AllocationFilter = {}) {
  return useQuery({
    queryKey: queryKeys.allocations.filtered(filter),
    queryFn: () => dataLayer.allocations.listBy(filter),
  })
}
