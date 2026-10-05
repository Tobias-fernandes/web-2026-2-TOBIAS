import type { Loadable } from "@/components/ui";
import type {
  CashFlowSummary,
  CycleProgress,
  DashboardMetrics,
  HoursByCategory,
  MemberWorkload,
  Project,
} from "@/domain/types";

/** How many of each record the management already has. */
export interface StartingCounts {
  clients: number;
  projects: number;
  memberships: number;
  deals: number;
  ledgerLines: number;
}

/** One kind of record an EJ that joined mid-term still has to bring over. */
export interface StartingChecklistEntry {
  label: string;
  text: string;
  to: string;
  isDone: (counts: StartingCounts) => boolean;
}

/** An entry, ticked off against what the management already has. */
export interface StartingChecklistItem extends Omit<
  StartingChecklistEntry,
  "isDone"
> {
  done: boolean;
}

/**
 * What is left to register after signing up mid-term. Null when there is
 * nothing to show: the management started with the system, the reader cannot
 * manage it, the board dismissed it, or everything is already in.
 */
export interface StartingChecklist {
  items: StartingChecklistItem[];
  dismiss: () => void;
}

/**
 * Everything the dashboard reads, resolved once.
 *
 * The screen receives this and does nothing but arrange it: no query call, no
 * sorting, no slicing. Whatever the panel needs to *know* is in `hooks.ts`;
 * whatever it needs to *show* is in the section components.
 */
export interface DashboardPageState {
  greeting: string;
  description: string;
  metrics: Loadable<DashboardMetrics>;
  progress: Loadable<CycleProgress | null>;
  cashFlow: Loadable<CashFlowSummary>;
  categories: Loadable<HoursByCategory[]>;
  workload: Loadable<MemberWorkload[]>;
  /** Only the head of the list, which is all the card has room for. */
  topWorkload: MemberWorkload[];
  projects: Loadable<Project[]>;
  /** Projects under way, soonest deadline first. */
  deadlines: Project[];
  checklist: StartingChecklist | null;
}
