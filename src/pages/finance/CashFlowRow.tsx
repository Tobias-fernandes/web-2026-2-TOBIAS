import { MetricCard, QueryState, SkeletonMetrics } from "@/components/ui";
import type { Loadable } from "@/components/ui";
import type { CashFlowSummary } from "@/domain/types";
import { formatMoney } from "@/lib/format";

/** What moved, what is still coming, and what is late. */
const CashFlowRow: React.FC<{
  cashFlow: Loadable<CashFlowSummary>;
}> = ({ cashFlow }) => {
  return (
    <QueryState
      query={cashFlow}
      skeleton={<SkeletonMetrics label="Somando o caixa…" />}
    >
      {(cash) => (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Saldo da gestão"
            value={formatMoney(cash.balanceCents)}
            hint={`${formatMoney(cash.receivedCents)} recebidos · ${formatMoney(cash.paidCents)} pagos`}
          />
          <MetricCard
            label="A receber"
            value={formatMoney(cash.toReceiveCents)}
            hint="Parcelas contratadas que ainda não entraram"
          />
          <MetricCard
            label="Vencido e não recebido"
            value={formatMoney(cash.overdueCents)}
            hint={
              cash.overdueCents > 0
                ? "Cobrança pendente com o cliente"
                : "Nenhuma parcela atrasada"
            }
          />
          <MetricCard
            label="A pagar"
            value={formatMoney(cash.toPayCents)}
            hint="Custos já assumidos pelas diretorias"
          />
        </div>
      )}
    </QueryState>
  );
};

export { CashFlowRow };
