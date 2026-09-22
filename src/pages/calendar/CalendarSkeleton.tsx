import { Skeleton, SkeletonList, SkeletonRegion } from '@/components/ui'
import { DAYS_IN_WEEK } from '@/lib/date'
import { WEEKDAY_HEADERS } from './constants'

/** Five weeks of empty cells, so the grid does not jump when the month lands. */
const WEEKS = 5

/** The whole screen's placeholder: the month and the panel beside it. */
export function CalendarSkeleton() {
  return (
    <SkeletonRegion
      label="Carregando o calendário…"
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="overflow-hidden rounded-xl border border-linha bg-papel-alto">
        <div className="grid grid-cols-7 border-b border-linha">
          {WEEKDAY_HEADERS.map((weekday) => (
            <div key={weekday} className="flex justify-center px-2 py-3">
              <Skeleton className="h-3 w-7" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: WEEKS * DAYS_IN_WEEK }, (_, index) => (
            <div
              key={index}
              className="min-h-[108px] border-r border-b border-linha p-1.5"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              {index % 3 === 0 && <Skeleton className="mt-1.5 h-4 w-full" />}
              {index % 5 === 0 && <Skeleton className="mt-1 h-4 w-4/5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-linha bg-papel-alto p-6">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 mb-5 h-3 w-1/3" />
        <SkeletonList count={3} label="Carregando o dia…" />
      </div>
    </SkeletonRegion>
  )
}
