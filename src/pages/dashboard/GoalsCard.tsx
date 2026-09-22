import {
  Card,
  CardLink,
  CardTitle,
  QueryState,
  SkeletonBars,
} from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { GoalProgressList } from "@/components/reports";
import { ROUTES } from "@/config/routes";
import type { CycleProgress } from "@/domain/types";

/** Goals of the management against the pace of the year. */
const GoalsCard: React.FC<{
  progress: Loadable<CycleProgress | null>;
}> = ({ progress }) => {
  return (
    <Card>
      <CardTitle
        action={<CardLink to={ROUTES.app.cycle}>Editar metas</CardLink>}
      >
        Metas da gestão
      </CardTitle>

      <QueryState
        query={progress}
        skeleton={<SkeletonBars />}
        empty={
          <p className="m-0 text-sm text-tinta-suave">
            Nenhuma gestão aberta. Cadastre-a em Gestão e metas.
          </p>
        }
      >
        {(data) => <GoalProgressList progress={data} />}
      </QueryState>
    </Card>
  );
};

export { GoalsCard };
