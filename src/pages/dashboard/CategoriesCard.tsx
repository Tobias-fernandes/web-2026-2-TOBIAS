import { Card, CardTitle, ListState, SkeletonBars } from "@/components/ui";
import type { Loadable } from "@/components/ui";
import { CategoryBreakdown } from "@/components/reports";
import type { HoursByCategory } from "@/domain/types";

/** Project work against everything else it takes to run the enterprise. */
const CategoriesCard: React.FC<{
  query: Loadable<HoursByCategory[]>;
}> = ({ query }) => {
  return (
    <Card>
      <CardTitle>Para onde foram as horas</CardTitle>

      <ListState
        query={query}
        rows={query.data ?? []}
        skeleton={<SkeletonBars count={5} />}
        empty={
          <p className="m-0 text-sm text-tinta-suave">
            Nenhuma hora lançada nesta gestão.
          </p>
        }
      >
        {(rows) => <CategoryBreakdown rows={rows} />}
      </ListState>
    </Card>
  );
};

export { CategoriesCard };
