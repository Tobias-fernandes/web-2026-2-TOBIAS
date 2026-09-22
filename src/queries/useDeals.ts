import { useMutation, useQuery } from '@tanstack/react-query'
import type { Deal, DealStage, ID } from '@/domain/types'
import { dataLayer } from '@/services'
import { createEntityQueries } from './createEntityQueries'
import { queryKeys } from './queryKeys'

const deals = createEntityQueries(queryKeys.deals, dataLayer.deals)

/** Every negotiation, across managements. */
export const useDeals = deals.useList
export const useDeal = deals.useDetail
export const useCreateDeal = deals.useCreate
export const useUpdateDeal = deals.useUpdate

/** The negotiations of one management. Waits for the cycle, like the projects. */
export function useCycleDeals(cycleId: ID | undefined) {
  return useQuery({
    queryKey: queryKeys.deals.filtered({ cycleId }),
    queryFn: () => dataLayer.deals.listBy({ cycleId }),
    enabled: Boolean(cycleId),
  })
}

/** Funnel moves go through the repository's own endpoint, not a generic update. */
export function useChangeDealStage() {
  return useMutation({
    mutationFn: ({
      id,
      stage,
      lossReason,
    }: {
      id: ID
      stage: DealStage
      lossReason?: Deal['lossReason']
    }) => dataLayer.deals.changeStage(id, stage, lossReason),
  })
}
