import type { Cycle, Project } from "@/domain/types";
import { useDismissed } from "@/lib/hooks";
import {
  useClients,
  useCycleDeals,
  useCycleMemberships,
  useFinanceEntries,
} from "@/queries";
import {
  STARTING_CHECKLIST_DISMISSED_KEY,
  STARTING_CHECKLIST_ITEMS,
} from "./constants";
import type { StartingChecklist } from "./types";

/**
 * What an EJ that signed up mid-term still has to bring over.
 *
 * Sign-up only asks for the figures no other screen can recover; the records
 * themselves each have a screen of their own, and this is the list that points
 * the board at them. It reads only while it can be shown, so the dashboard of
 * a management that started with the system pays nothing for it.
 */
export function useStartingChecklist(
  cycle: Cycle | null,
  manager: boolean,
  projects: Project[] | undefined,
): StartingChecklist | null {
  const [dismissed, dismiss] = useDismissed(
    cycle ? STARTING_CHECKLIST_DISMISSED_KEY(cycle.id) : null,
  );
  const relevant = Boolean(cycle?.startingPoint) && manager && !dismissed;
  const scopedId = relevant ? cycle?.id : undefined;

  const clients = useClients({ enabled: relevant });
  const memberships = useCycleMemberships(scopedId);
  const deals = useCycleDeals(scopedId);
  const ledger = useFinanceEntries(scopedId);

  // Nothing is ticked off until every read is in, so an item never flashes
  // as pending and then disappears.
  if (
    !relevant ||
    !projects ||
    !clients.data ||
    !memberships.data ||
    !deals.data ||
    !ledger.data
  ) {
    return null;
  }

  const counts = {
    clients: clients.data.length,
    projects: projects.length,
    memberships: memberships.data.length,
    deals: deals.data.length,
    ledgerLines: ledger.data.length,
  };
  const items = STARTING_CHECKLIST_ITEMS.map(({ isDone, ...item }) => ({
    ...item,
    done: isDone(counts),
  }));

  return items.every((item) => item.done) ? null : { items, dismiss };
}
