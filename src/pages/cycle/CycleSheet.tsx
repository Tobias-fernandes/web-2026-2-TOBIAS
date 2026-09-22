import { Card, CardTitle, Note } from "@/components/ui";
import { CYCLE_STATUS_LABELS } from "@/domain/constants";
import type { Cycle } from "@/domain/types";
import { formatMoney, formatPeriod, formatScore } from "@/lib/format";

/** The four facts that define a management, in the order a board asks for them. */
function factsOf(cycle: Cycle) {
  return [
    {
      label: "Período",
      value: formatPeriod(cycle.startsAt, cycle.endsAt),
    },
    { label: "Situação", value: CYCLE_STATUS_LABELS[cycle.status] },
    {
      label: "Meta de faturamento",
      value: formatMoney(cycle.goals.revenueCents),
    },
    { label: "Meta de satisfação", value: formatScore(cycle.goals.npsScore) },
  ];
}

const CycleSheet: React.FC<{ cycle: Cycle }> = ({ cycle }) => {
  return (
    <Card>
      <CardTitle>Ficha da gestão</CardTitle>

      <dl className="m-0 flex flex-col gap-3">
        {factsOf(cycle).map((fact) => (
          <div
            key={fact.label}
            className="flex items-baseline justify-between gap-3 border-b border-linha pb-2 last:border-0 last:pb-0"
          >
            <dt className="text-base leading-relaxed text-tinta-suave">
              {fact.label}
            </dt>
            <dd className="m-0 text-right font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <Note>
        Encerrar a gestão não apaga nada: os projetos, as horas e os números
        continuam ligados a ela, e é assim que uma diretoria compara o próprio
        ano com o da diretoria anterior.
      </Note>
    </Card>
  );
};

export { CycleSheet };
