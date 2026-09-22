import { describeCycle } from "@/domain/constants";
import { isActiveProject } from "@/domain/rules";
import { daysUntil } from "@/lib/date";
import {
  useActiveCycle,
  useCashFlow,
  useCycleProgress,
  useCycleProjects,
  useDashboardMetrics,
  useHoursByCategory,
  useWorkloadByMember,
} from "@/queries";
import { useCurrentUser } from "@/stores/auth";
import { WORKLOAD_CHART_LIMIT } from "./constants";
import type { DashboardPageState } from "./types";

/**
 * The panel's reads and the handful of derivations on top of them.
 *
 * `cycle === null` means two different things — the managements have not loaded
 * yet, or this EJ never opened one — and the description is the only place that
 * has to tell them apart.
 */
function describe(cycleName: string | undefined, loading: boolean): string {
  if (cycleName) {
    return `Gestão ${cycleName} em números: metas, prazos, caixa e a carga da equipe.`;
  }
  return loading
    ? "Metas, prazos, caixa e a carga da equipe da gestão em andamento."
    : "Cadastre a gestão do ano para o painel ter um período de referência.";
}

export function useDashboardPage(): DashboardPageState {
  const user = useCurrentUser();
  const { cycle, isPending: cyclePending } = useActiveCycle();
  const scope = { cycleId: cycle?.id };

  const metrics = useDashboardMetrics(scope);
  const progress = useCycleProgress(cycle?.id);
  const cashFlow = useCashFlow(scope);
  const categories = useHoursByCategory(scope);
  const workload = useWorkloadByMember(scope);
  const projects = useCycleProjects(cycle?.id);

  return {
    greeting: `Olá, ${user?.name.split(" ")[0] ?? "membro"}`,
    description: describe(
      cycle ? describeCycle(cycle) : undefined,
      cyclePending,
    ),
    metrics,
    progress,
    cashFlow,
    categories,
    workload,
    topWorkload: (workload.data ?? []).slice(0, WORKLOAD_CHART_LIMIT),
    projects,
    deadlines: (projects.data ?? [])
      .filter(isActiveProject)
      .sort((a, b) => daysUntil(a.dueAt) - daysUntil(b.dueAt)),
  };
}
