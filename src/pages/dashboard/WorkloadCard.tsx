import {
  Card,
  CardLink,
  CardTitle,
  ListState,
  Note,
  ProgressBar,
  SkeletonBars,
} from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { OVERLOAD_THRESHOLD } from "@/domain/constants";
import type { MemberWorkload } from "@/domain/types";
import { formatHours, formatPercent } from "@/lib/format";

/** Logged hours against the load each member committed to. */
const WorkloadCard: React.FC<{
  query: Loadable<MemberWorkload[]>;
  rows: MemberWorkload[];
}> = ({ query, rows }) => {
  return (
    <Card>
      <CardTitle
        action={<CardLink to={ROUTES.app.allocation}>Alocação</CardLink>}
      >
        Carga da equipe
      </CardTitle>

      <ListState
        query={query}
        rows={rows}
        skeleton={<SkeletonBars count={5} />}
        empty={
          <p className="m-0 text-sm text-tinta-suave">
            Nenhuma hora lançada nesta gestão.
          </p>
        }
      >
        {(workload) => (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {workload.map((row) => (
              <li key={row.memberId}>
                <ProgressBar
                  ratio={row.utilization}
                  tone={row.overload > OVERLOAD_THRESHOLD ? "amber" : "violet"}
                  label={row.name}
                  value={`${formatHours(row.loggedHours)} · ${formatPercent(row.utilization)}`}
                />
              </li>
            ))}
          </ul>
        )}
      </ListState>

      <Note>
        Compara as horas lançadas com a carga pactuada até hoje — não com a do
        ano inteiro.
      </Note>
    </Card>
  );
};

export { WorkloadCard };
