import { Card, CardTitle, QueryState, SkeletonMetrics } from "@/components/ui";
import type { Loadable } from "@/components/ui";
import type { DashboardMetrics } from "@/domain/types";
import { formatHours, formatMoney, formatScore } from "@/lib/format";

/** The eight figures a management hands over at the end of the year. */
function figuresOf(data: DashboardMetrics) {
  return [
    {
      label: "Faturamento contratado",
      value: formatMoney(data.contractedRevenueCents),
    },
    {
      label: "Recebido em caixa",
      value: formatMoney(data.receivedRevenueCents),
    },
    { label: "Projetos entregues", value: String(data.projectsDelivered) },
    { label: "Horas lançadas", value: formatHours(data.loggedHours) },
    { label: "Projetos em andamento", value: String(data.projectsInProgress) },
    { label: "Membros na gestão", value: String(data.activeMembers) },
    { label: "Clientes ativos", value: String(data.activeClients) },
    {
      label: "Satisfação média",
      value: data.averageNps !== null ? formatScore(data.averageNps) : "—",
    },
  ];
}

const SummaryCard: React.FC<{
  metrics: Loadable<DashboardMetrics>;
  cycleName: string;
}> = ({ metrics, cycleName }) => {
  return (
    <QueryState
      query={metrics}
      skeleton={
        <SkeletonMetrics
          count={8}
          label="Consolidando números…"
          className="mb-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        />
      }
    >
      {(data) => (
        <Card className="mb-5">
          <CardTitle>Resumo da gestão {cycleName}</CardTitle>
          <dl className="m-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {figuresOf(data).map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold text-tinta-suave">
                  {item.label}
                </dt>
                <dd className="m-0 mt-1 font-display text-xl font-bold">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </QueryState>
  );
};

export { SummaryCard };
