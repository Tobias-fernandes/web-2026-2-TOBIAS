import { PageHeader } from '@/components/layout'
import { Button, FormDialog, QueryState } from '@/components/ui'
import { CalendarSkeleton } from './CalendarSkeleton'
import { CalendarToolbar } from './CalendarToolbar'
import { DaySchedule } from './DaySchedule'
import { EventForm } from './EventForm'
import { MonthGrid } from './MonthGrid'
import { UpcomingEvents } from './UpcomingEvents'
import { useCalendarPage } from './hooks'

export function CalendarPage() {
  const agenda = useCalendarPage()
  const editing = agenda.dialog.editing !== null


  return (
    <>
      <PageHeader
        title="Calendário"
        description="Reuniões, capacitações, processo seletivo e eventos da gestão em um lugar só — com as entregas dos projetos marcadas junto, para que a semana cheia apareça antes de acontecer."
        action={
          agenda.editable && (
            <Button onClick={() => agenda.openDialog()}>Novo compromisso</Button>
          )
        }
      />

      <CalendarToolbar {...agenda} />

      <QueryState query={agenda.events} skeleton={<CalendarSkeleton />}>
        {() => (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
            <MonthGrid days={agenda.days} onSelect={agenda.selectDate} />

            <div className="flex flex-col gap-6">
              <DaySchedule {...agenda} />
              <UpcomingEvents {...agenda} />
            </div>
          </div>
        )}
      </QueryState>

      <FormDialog
        open={agenda.dialog.open}
        title={editing ? 'Editar compromisso' : 'Novo compromisso'}
        submitLabel={editing ? 'Salvar alterações' : 'Agendar'}
        error={agenda.dialog.error}
        submitting={agenda.dialog.submitting}
        onSubmit={agenda.dialog.submit}
        onClose={agenda.dialog.close}
      >
        <EventForm
          value={agenda.dialog.form}
          projects={agenda.projects}
          onChange={agenda.dialog.setForm}
        />
      </FormDialog>
    </>
  )
}
