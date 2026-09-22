import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import type { CreateInput, Cycle, ID } from "@/domain/types";
import { dataLayer } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

const cycles = createEntityQueries(queryKeys.cycles, dataLayer.cycles);

export const useCycles = cycles.useList;
export const useCycle = cycles.useDetail;
export const useCreateCycle = cycles.useCreate;
export const useUpdateCycle = cycles.useUpdate;

/**
 * Writes a management, whether it exists yet or not.
 *
 * The screen that opens this dialog does not care which it is — the fields are
 * the same either way — so the branch lives here instead of forcing the page to
 * carry two dialogs, two field mappings and two mutations for one form.
 */
export function useUpsertCycle() {
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: ID | null;
      input: CreateInput<Cycle>;
    }) =>
      id ? dataLayer.cycles.update(id, input) : dataLayer.cycles.create(input),
  });
}

export interface ActiveCycle {
  cycle: Cycle | null;
  /** Still loading — which is not the same as "this EJ has no management". */
  isPending: boolean;
  /**
   * Loaded, and there is none: the first day of an EJ, before anyone opened the
   * year. Every read scoped to a cycle stays disabled in this state, so a screen
   * that does not check it waits on a request that will never be sent.
   */
  missing: boolean;
}

/**
 * The management every screen scopes itself to.
 *
 * Falls back to the most recent one so a system whose board forgot to open the
 * new one still shows something instead of an empty dashboard.
 *
 * `isPending` is returned alongside because the two states read identically
 * from a `null` cycle and mean opposite things: while it is loading, a screen
 * that filters by cycle would briefly show nothing and tell the reader to go
 * create a management that already exists.
 */
export const useActiveCycle = (): ActiveCycle => {
  const { data, isPending } = useCycles();

  const cycle = useMemo(() => {
    const all = data ?? [];
    return (
      all.find((item) => item.status === "active") ??
      [...all].sort((a, b) => b.startsAt.localeCompare(a.startsAt))[0] ??
      null
    );
  }, [data]);

  return { cycle, isPending, missing: !isPending && cycle === null };
};
