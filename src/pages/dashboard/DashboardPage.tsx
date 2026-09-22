import { PageHeader } from "@/components/layout";
import { CashFlowCard } from "./CashFlowCard";
import { CategoriesCard } from "./CategoriesCard";
import { DeadlinesCard } from "./DeadlinesCard";
import { GoalsCard } from "./GoalsCard";
import { MetricsRow } from "./MetricsRow";
import { WorkloadCard } from "./WorkloadCard";
import { useDashboardPage } from "./hooks";

/**
 * The board's home screen.
 *
 * Reads nothing and derives nothing: `hooks.ts` resolves the management and its
 * six reads, and each card below knows how to draw one of them. What is left
 * here is the arrangement, which is the only thing this file should be about.
 */
export function DashboardPage() {
  const panel = useDashboardPage();


  return (
    <>
      <PageHeader title={panel.greeting} description={panel.description} />

      <MetricsRow metrics={panel.metrics} />

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <GoalsCard progress={panel.progress} />
        <DeadlinesCard query={panel.projects} rows={panel.deadlines} />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <WorkloadCard query={panel.workload} rows={panel.topWorkload} />
        <CategoriesCard query={panel.categories} />
        <CashFlowCard query={panel.cashFlow} />
      </div>
    </>
  );
}
