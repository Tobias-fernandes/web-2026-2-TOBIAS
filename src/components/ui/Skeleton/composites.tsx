import { Skeleton } from "./Skeleton";
import { SkeletonRegion } from "./SkeletonRegion";
import type { SkeletonCountProps, SkeletonTableProps } from "./types";

/** The shell of a table: the border, a header rule and the rows. */
const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  label = "Carregando a tabela…",
  className,
}) => {
  return (
    <SkeletonRegion label={label} className={className}>
      <div className="overflow-hidden rounded-xl border border-linha bg-papel-alto">
        <div className="flex gap-6 border-b border-linha px-4 py-4">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton
              key={index}
              className={index === 0 ? "h-3 flex-[2]" : "h-3 flex-1"}
            />
          ))}
        </div>

        {Array.from({ length: rows }, (_, row) => (
          <div
            key={row}
            className="flex gap-6 border-b border-linha px-4 py-4 last:border-0"
          >
            {Array.from({ length: columns }, (_, index) => (
              <Skeleton
                key={index}
                className={index === 0 ? "h-4 flex-[2]" : "h-4 flex-1"}
              />
            ))}
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
};

/** The row of headline figures at the top of a screen. */
const SkeletonMetrics: React.FC<SkeletonCountProps> = ({
  count = 4,
  label = "Somando os indicadores…",
  className,
}) => {
  return (
    <SkeletonRegion
      label={label}
      className={className ?? "mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-linha bg-papel-alto p-5"
        >
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="mt-3.5 h-7 w-3/5" />
          <Skeleton className="mt-3 h-3 w-4/5" />
        </div>
      ))}
    </SkeletonRegion>
  );
};

/** A list of labelled progress bars: goals, workload, hours by category. */
const SkeletonBars: React.FC<SkeletonCountProps> = ({
  count = 4,
  label = "Calculando…",
  className,
}) => {
  return (
    <SkeletonRegion label={label} className={className}>
      <div className="flex flex-col gap-4">
        {Array.from({ length: count }, (_, index) => (
          <div key={index}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
};

/** Stacked cards, as on the project board or a list of deadlines. */
const SkeletonList: React.FC<SkeletonCountProps> = ({
  count = 4,
  label = "Carregando…",
  className,
}) => {
  return (
    <SkeletonRegion label={label} className={className}>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-lg border border-linha bg-papel px-3 py-3"
          >
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
};

/** Columns of cards, as on the project board and the commercial funnel. */
const SkeletonBoard: React.FC<SkeletonCountProps> = ({
  count = 4,
  label = "Carregando o quadro…",
  className,
}) => {
  return (
    <SkeletonRegion
      label={label}
      className={className ?? "grid gap-5 md:grid-cols-2 xl:grid-cols-4"}
    >
      {Array.from({ length: count }, (_, column) => (
        <div
          key={column}
          className="rounded-xl border border-linha bg-papel-alto p-3"
        >
          <div className="mb-3 flex items-baseline justify-between border-b border-linha px-1 pb-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: column === 0 ? 2 : 1 }, (_, card) => (
              <div
                key={card}
                className="rounded-lg border border-linha bg-papel p-3"
              >
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
                <Skeleton className="mt-3.5 h-5 w-2/5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </SkeletonRegion>
  );
};

/** Label on the left, figure on the right: the cash-flow and term-sheet lists. */
const SkeletonRows: React.FC<SkeletonCountProps> = ({
  count = 4,
  label = "Carregando…",
  className,
}) => {
  return (
    <SkeletonRegion label={label} className={className}>
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="flex items-baseline justify-between gap-4 border-b border-linha pb-3 last:border-0 last:pb-0"
          >
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3.5 w-1/4" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
};

/** A row of pill-shaped filters, as the term picker. */
const SkeletonChips: React.FC<SkeletonCountProps> = ({
  count = 3,
  label = "Carregando…",
  className,
}) => {
  return (
    <SkeletonRegion label={label} className={className}>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: count }, (_, index) => (
          <Skeleton key={index} className="h-8 w-24" />
        ))}
      </div>
    </SkeletonRegion>
  );
};

export { SkeletonTable };

export {
  SkeletonMetrics,
  SkeletonBars,
  SkeletonList,
  SkeletonBoard,
  SkeletonRows,
  SkeletonChips,
};
