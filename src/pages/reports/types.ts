import type { Loadable } from "@/components/ui";
import type {
  Cycle,
  DashboardMetrics,
  HoursByCategory,
  MemberWorkload,
  ProjectMargin,
} from "@/domain/types";

export interface ReportPeriodState {
  cycleId: string;
  from: string;
  to: string;
}

export interface ReportsPageState {
  cycles: Cycle[];
  period: ReportPeriodState;
  setPeriod: (period: ReportPeriodState) => void;
  /** Clears the dates, keeping the management — the "gestão inteira" button. */
  resetPeriod: () => void;
  cycleName: string;
  metrics: Loadable<DashboardMetrics>;
  margins: Loadable<ProjectMargin[]>;
  workload: Loadable<MemberWorkload[]>;
  categories: Loadable<HoursByCategory[]>;
}
