import {
  Badge,
  Card,
  CardLink,
  CardTitle,
  EmptyState,
  ListState,
  SkeletonList,
} from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import type { Project } from "@/domain/types";
import { daysUntil } from "@/lib/date";
import { URGENT_DUE_DAYS } from "./constants";

/** How many days are left, said the way a person would say it. */
function dueLabel(days: number): string {
  return days < 0 ? `Atrasado ${Math.abs(days)} d` : `Prazo em ${days} d`;
}

const DeadlinesCard: React.FC<{
  query: Loadable<Project[]>;
  rows: Project[];
}> = ({ query, rows }) => {
  return (
    <Card>
      <CardTitle
        action={<CardLink to={ROUTES.app.projects}>Ver quadro</CardLink>}
      >
        Prazos mais próximos
      </CardTitle>

      <ListState
        query={query}
        rows={rows}
        skeleton={<SkeletonList />}
        empty={
          <EmptyState
            title="Nenhum projeto em andamento"
            description="Assim que um contrato entrar em execução, ele aparece aqui ordenado por prazo."
          />
        }
      >
        {(projects) => (
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {projects.map((project) => {
              const days = daysUntil(project.dueAt);

              return (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-linha bg-papel px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="m-0 text-base font-semibold">
                      {project.name}
                    </p>
                    <p className="m-0 text-sm text-tinta-suave">
                      {project.stage}
                    </p>
                  </div>
                  <Badge tone={days <= URGENT_DUE_DAYS ? "amber" : "neutral"}>
                    {dueLabel(days)}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </ListState>
    </Card>
  );
};

export { DeadlinesCard };
