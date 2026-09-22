import { Link } from "react-router-dom";
import { MetricCard, QueryState, SkeletonMetrics } from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import type { DashboardMetrics } from "@/domain/types";
import { formatHours, formatMoney, formatScore } from "@/lib/format";

/** The four headline figures of the management. */
const MetricsRow: React.FC<{
  metrics: Loadable<DashboardMetrics>;
}> = ({ metrics }) => {
  return (
    <QueryState query={metrics} skeleton={<SkeletonMetrics />}>
      {(data) => (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Faturamento contratado"
            value={formatMoney(data.contractedRevenueCents)}
            hint={`${formatMoney(data.receivedRevenueCents)} já entraram no caixa`}
          />
          <MetricCard
            label="Horas lançadas"
            value={formatHours(data.loggedHours)}
            hint={
              <Link to={ROUTES.app.timeEntries}>Ver a grade da semana</Link>
            }
          />
          <MetricCard
            label="Projetos em andamento"
            value={String(data.projectsInProgress)}
            hint={`${data.projectsDelivered} entregues · ${data.projectsPlanning} em planejamento`}
          />
          <MetricCard
            label="Funil em aberto"
            value={formatMoney(data.openPipelineCents)}
            hint={
              data.averageNps !== null
                ? `Satisfação média ${formatScore(data.averageNps)}`
                : "Sem avaliação de cliente ainda"
            }
          />
        </div>
      )}
    </QueryState>
  );
};

export { MetricsRow };
