import { CycleGoalsFields } from '@/components/forms'
import { SelectField, TextField, labelOptions } from '@/components/ui'
import { CYCLE_STATUS_LABELS } from '@/domain/constants'
import type { CycleStatus } from '@/domain/types'
import { setField } from '@/lib/utils'
import type { CycleFormState } from './types'

const STATUS_OPTIONS = labelOptions(CYCLE_STATUS_LABELS)

interface CycleFormProps {
  value: CycleFormState
  onChange: (next: CycleFormState) => void
}

export function CycleForm({ value, onChange }: CycleFormProps) {
  const set = setField(value, onChange)

  return (
    <>
      {/*
        Sem nome e sem data de fim de propósito. Uma EJ não batiza a gestão — diz
        "a gestão de 2026", que é o ano em que ela abriu — e não sabe o dia da
        passagem de bastão até ele chegar. O fim é carimbado ao encerrar.
      */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Início"
          hint="O dia em que a diretoria assumiu. É o ano dele que dá nome à gestão."
          type="date"
          value={value.startsAt}
          onChange={(event) => set('startsAt', event.target.value)}
        />
        <SelectField
          label="Situação"
          hint="Marcar como encerrada registra a data de hoje como o fim da gestão."
          value={value.status}
          options={STATUS_OPTIONS}
          onChange={(event) => set('status', event.target.value as CycleStatus)}
        />
      </div>

      <fieldset className="m-0 mt-2 border-0 p-0">
        <legend className="mb-3 text-sm font-semibold text-tinta">
          Metas da gestão
        </legend>
        <CycleGoalsFields value={value} onChange={(goals) => onChange({ ...value, ...goals })} />
      </fieldset>
    </>
  )
}
