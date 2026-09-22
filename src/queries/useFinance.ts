import { useMutation, useQuery } from "@tanstack/react-query";
import type { ID, IsoDate } from "@/domain/types";
import { dataLayer, type FinanceFilter } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

const finance = createEntityQueries(queryKeys.finance, dataLayer.finance);

export const useCreateFinanceEntry = finance.useCreate;
export const useUpdateFinanceEntry = finance.useUpdate;
export const useRemoveFinanceEntry = finance.useRemove;

/** The ledger of one management. Waits for the cycle, like every scoped read. */
export function useFinanceEntries(
  cycleId: ID | undefined,
  filter: Omit<FinanceFilter, "cycleId"> = {},
) {
  return useQuery({
    queryKey: queryKeys.finance.filtered({ ...filter, cycleId }),
    queryFn: () => dataLayer.finance.listBy({ ...filter, cycleId }),
    enabled: Boolean(cycleId),
    placeholderData: (previous) => previous,
  });
}

/** Marks a line as paid or received — or clears the date, undoing a mistake. */
export function useSettleFinanceEntry() {
  return useMutation({
    mutationFn: ({ id, paidAt }: { id: ID; paidAt: IsoDate | null }) =>
      dataLayer.finance.settle(id, paidAt),
  });
}
