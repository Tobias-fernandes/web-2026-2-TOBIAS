import { useMutation, useQuery } from "@tanstack/react-query";
import type { CalendarEvent, CreateInput, ID, IsoDate } from "@/domain/types";
import { dataLayer } from "@/services";
import { createEntityQueries } from "./createEntityQueries";
import { queryKeys } from "./queryKeys";

const calendarEvents = createEntityQueries(
  queryKeys.calendarEvents,
  dataLayer.calendarEvents,
);

export const useRemoveCalendarEvent = calendarEvents.useRemove;

/**
 * The commitments of one management inside a range — the month on screen.
 *
 * Only the visible weeks are read: an EJ's calendar is small, but a year of it
 * still has no business crossing the wire so that one month can be drawn.
 *
 * `placeholderData` keeps the month that is leaving on screen while the next
 * one loads, so stepping through the arrows does not flash an empty grid on
 * every click. Disabled until the cycle lands, for the same reason the project
 * board is: an empty calendar and a calendar that has not loaded look identical.
 */
export function useCycleCalendarEvents(
  cycleId: ID | undefined,
  from: IsoDate,
  to: IsoDate,
) {
  const filter = { cycleId, from, to };

  return useQuery({
    queryKey: queryKeys.calendarEvents.filtered(filter),
    queryFn: () => dataLayer.calendarEvents.listBy(filter),
    enabled: Boolean(cycleId),
    placeholderData: (previous) => previous,
  });
}

/**
 * Writes a commitment, whether it exists yet or not.
 *
 * Same reasoning as `useUpsertCycle`: the dialog's fields do not change between
 * scheduling something and correcting it, so the branch belongs here instead of
 * forcing the screen to carry two dialogs over one form.
 */
export function useUpsertCalendarEvent() {
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: ID | null;
      input: CreateInput<CalendarEvent>;
    }) =>
      id
        ? dataLayer.calendarEvents.update(id, input)
        : dataLayer.calendarEvents.create(input),
  });
}

/** Calls a commitment off, or puts it back on. Never deletes it. */
export function useCancelCalendarEvent() {
  return useMutation({
    mutationFn: ({ id, cancelled }: { id: ID; cancelled: boolean }) =>
      dataLayer.calendarEvents.cancel(id, cancelled),
  });
}
