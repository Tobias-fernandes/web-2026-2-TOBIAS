import { Button, Card, SelectField, nameOptions } from '@/components/ui'
import { formatDate, formatDayMonth, formatHours } from '@/lib/format'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons'
import type { TimesheetPageState } from './types'

type WeekToolbarProps = Pick<
  TimesheetPageState,
  | 'weekStart'
  | 'weekEnd'
  | 'isCurrentWeek'
  | 'goToWeek'
  | 'goToToday'
  | 'weekTotal'
  | 'committed'
  | 'seesEveryone'
  | 'members'
  | 'memberId'
  | 'setMemberId'
>

/** Which week is on screen, whose it is, and the one-click submit. */
export function WeekToolbar(props: WeekToolbarProps) {
  return (
    <Card className="mb-5 p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-2">
          <Button variant="subtle" onClick={() => props.goToWeek(-1)}>
            <ChevronLeftIcon size={15} />
            Semana anterior
          </Button>

          <div className="px-1">
            <p className="m-0 font-display text-base font-bold">
              {formatDayMonth(props.weekStart)} a {formatDate(props.weekEnd)}
            </p>
            <p className="m-0 text-xs text-tinta-suave">
              {props.isCurrentWeek ? 'Semana atual' : 'Outra semana'} ·{' '}
              {formatHours(props.weekTotal)} lançadas
              {props.committed > 0 && ` de ${formatHours(props.committed)} pactuadas`}
            </p>
          </div>

          <Button variant="subtle" onClick={() => props.goToWeek(1)}>
            Próxima semana
            <ChevronRightIcon size={15} />
          </Button>

          {!props.isCurrentWeek && (
            <Button variant="subtle" onClick={props.goToToday}>
              Hoje
            </Button>
          )}
        </div>

        {props.seesEveryone && (
          <div className="min-w-[220px]">
            <SelectField
              label="Membro"
              value={props.memberId}
              onChange={(event) => props.setMemberId(event.target.value)}
              options={nameOptions(props.members)}
            />
          </div>
        )}
      </div>

    </Card>
  )
}
