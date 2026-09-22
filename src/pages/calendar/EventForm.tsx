import {
  labelOptions,
  nameOptions,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui'
import {
  DIRECTORATE_LABELS,
  EVENT_AUDIENCE_LABELS,
  EVENT_KIND_LABELS,
  EVENT_KIND_ORDER,
} from '@/domain/constants'
import type { Directorate, EventAudience, EventKind, Project } from '@/domain/types'
import { setField } from '@/lib/utils'
import type { EventFormState } from './types'

interface EventFormProps {
  value: EventFormState
  projects: Project[]
  onChange: (value: EventFormState) => void
}

/** Offered in the order an EJ schedules them, not alphabetically. */
const KIND_OPTIONS = EVENT_KIND_ORDER.map((kind) => ({
  value: kind,
  label: EVENT_KIND_LABELS[kind],
}))

const DIRECTORATE_OPTIONS = labelOptions(DIRECTORATE_LABELS)
const AUDIENCE_OPTIONS = labelOptions(EVENT_AUDIENCE_LABELS)

/**
 * All-day as a two-option picker rather than a checkbox.
 *
 * It is the field that decides whether the two time pickers below exist at all,
 * and a checkbox tucked between labelled fields is the one control a reader
 * skips — then wonders why the hours will not save.
 */
const DURATION_OPTIONS = [
  { value: 'timed', label: 'Com horário' },
  { value: 'allDay', label: 'Dia todo' },
]

export function EventForm({ value, projects, onChange }: EventFormProps) {
  const set = setField(value, onChange)

  return (
    <>
      <TextField
        label="Título"
        value={value.title}
        onChange={(event) => set('title', event.target.value)}
        placeholder="Reunião de diretoria executiva"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Tipo"
          value={value.kind}
          onChange={(event) => set('kind', event.target.value as EventKind)}
          options={KIND_OPTIONS}
        />
        <SelectField
          label="Diretoria responsável"
          value={value.directorate}
          onChange={(event) =>
            set('directorate', event.target.value as Directorate)
          }
          options={DIRECTORATE_OPTIONS}
        />
      </div>

      <SelectField
        label="Quem participa"
        hint="Marcar como da diretoria não esconde o compromisso: sinaliza de quem é a presença esperada."
        value={value.audience}
        onChange={(event) => set('audience', event.target.value as EventAudience)}
        options={AUDIENCE_OPTIONS}
      />

      <SelectField
        label="Duração"
        value={value.allDay ? 'allDay' : 'timed'}
        onChange={(event) => set('allDay', event.target.value === 'allDay')}
        options={DURATION_OPTIONS}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Início"
          type="date"
          value={value.startsAt}
          onChange={(event) =>
            onChange({
              ...value,
              startsAt: event.target.value,
              // Moving the start of a single-day commitment moves the whole of
              // it; a term that ends before it begins is not worth making the
              // member fix by hand.
              endsAt:
                value.endsAt < event.target.value ? event.target.value : value.endsAt,
            })
          }
        />
        <TextField
          label="Término"
          hint="Deixe no mesmo dia para um compromisso único."
          type="date"
          min={value.startsAt}
          value={value.endsAt}
          onChange={(event) => set('endsAt', event.target.value)}
        />
      </div>

      {!value.allDay && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Começa às"
            type="time"
            value={value.startTime}
            onChange={(event) => set('startTime', event.target.value)}
          />
          <TextField
            label="Termina às"
            type="time"
            value={value.endTime}
            onChange={(event) => set('endTime', event.target.value)}
          />
        </div>
      )}

      <TextField
        label="Local"
        value={value.location}
        onChange={(event) => set('location', event.target.value)}
        placeholder="Sala da EJ, sede do cliente, remoto…"
      />

      <TextField
        label="Link da reunião"
        hint="Opcional. Para o que acontece on-line."
        type="url"
        value={value.onlineUrl}
        onChange={(event) => set('onlineUrl', event.target.value)}
        placeholder="https://meet.google.com/…"
      />

      <SelectField
        label="Projeto relacionado"
        hint="Opcional. Liga a reunião ao projeto — kickoff, checkpoint, entrega."
        value={value.projectId}
        onChange={(event) => set('projectId', event.target.value)}
        options={[{ value: '', label: 'Nenhum' }, ...nameOptions(projects)]}
      />

      <TextAreaField
        label="Descrição"
        value={value.description}
        onChange={(event) => set('description', event.target.value)}
        placeholder="Pauta, o que levar, o que precisa estar pronto antes."
      />
    </>
  )
}
