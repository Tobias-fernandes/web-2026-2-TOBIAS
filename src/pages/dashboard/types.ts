import type { Loadable } from "@/components/ui";
import type {
  CashFlowSummary,
  CycleProgress,
  DashboardMetrics,
  HoursByCategory,
  MemberWorkload,
  Project,
} from "@/domain/types";

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
}
