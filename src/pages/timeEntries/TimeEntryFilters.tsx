import { Button, Card, SelectField, TextField } from '@/components/ui'
import type { Member, Project } from '@/domain/types'
import { formatHours } from '@/lib/format'
import type { TimeEntryFilterState } from './types'

interface TimeEntryFiltersProps {
  value: TimeEntryFilterState
  members: Member[]
  projects: Project[]
  totalHours: number
  entryCount: number
  onChange: (value: TimeEntryFilterState) => void
  onClear: () => void
}

export function TimeEntryFilters({
  value,
  members,
  projects,
  totalHours,
  entryCount,
  onChange,
  onClear,
}: TimeEntryFiltersProps) {
  const set = <K extends keyof TimeEntryFilterState>(
    key: K,
    fieldValue: TimeEntryFilterState[K],
  ) => onChange({ ...value, [key]: fieldValue })

  return (
    <Card className="mb-5 p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <SelectField
          label="Membro"
          value={value.memberId}
          onChange={(event) => set('memberId', event.target.value)}
          options={[
            { value: '', label: 'Todos' },
            ...members.map((member) => ({
              value: member.id,
              label: member.name,
            })),
          ]}
        />
        <SelectField
          label="Projeto"
          value={value.projectId}
          onChange={(event) => set('projectId', event.target.value)}
          options={[
            { value: '', label: 'Todos' },
            ...projects.map((project) => ({
              value: project.id,
              label: project.name,
            })),
          ]}
        />
        <TextField
          label="De"
          type="date"
          value={value.from}
          onChange={(event) => set('from', event.target.value)}
        />
        <TextField
          label="Até"
          type="date"
          value={value.to}
          onChange={(event) => set('to', event.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[0.9rem] text-tinta-suave">
          Total no filtro:{' '}
          <strong className="font-display text-tinta">
            {formatHours(totalHours)}
          </strong>{' '}
          em {entryCount} lançamento(s).
        </p>
        <Button variant="subtle" onClick={onClear}>
          Limpar filtros
        </Button>
      </div>
    </Card>
  )
}
