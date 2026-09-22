import {
  labelOptions,
  nameOptions,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui'
import { DEAL_SOURCE_LABELS, DEAL_STAGE_LABELS, DEAL_FUNNEL_COLUMNS } from '@/domain/constants'
import type { Client, DealSource, DealStage, Member } from '@/domain/types'
import { setField } from '@/lib/utils'
import type { DealFormState } from './types'

interface DealFormProps {
  value: DealFormState
  clients: Client[]
  members: Member[]
  onChange: (value: DealFormState) => void
}

const SOURCE_OPTIONS = labelOptions(DEAL_SOURCE_LABELS)

const STAGE_OPTIONS = DEAL_FUNNEL_COLUMNS.map((stage) => ({
  value: stage,
  label: DEAL_STAGE_LABELS[stage],
}))

export function DealForm({ value, clients, members, onChange }: DealFormProps) {
  const set = setField(value, onChange)

  return (
    <>
      <TextField
        label="O que está sendo negociado"
        value={value.title}
        placeholder="Site institucional com catálogo"
        onChange={(event) => set('title', event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Cliente"
          value={value.clientId}
          onChange={(event) => set('clientId', event.target.value)}
          options={nameOptions(clients)}
        />
        <SelectField
          label="Responsável"
          value={value.ownerId}
          onChange={(event) => set('ownerId', event.target.value)}
          options={nameOptions(members)}
        />
        <SelectField
          label="Etapa"
          value={value.stage}
          onChange={(event) => set('stage', event.target.value as DealStage)}
          options={STAGE_OPTIONS}
        />
        <SelectField
          label="Origem"
          hint="É o que permite saber de onde vêm os contratos que fecham."
          value={value.source}
          onChange={(event) => set('source', event.target.value as DealSource)}
          options={SOURCE_OPTIONS}
        />
        <TextField
          label="Valor estimado (R$)"
          inputMode="decimal"
          value={value.value}
          placeholder="3200"
          onChange={(event) => set('value', event.target.value)}
        />
        <TextField
          label="Previsão de fechamento"
          type="date"
          value={value.expectedCloseAt}
          onChange={(event) => set('expectedCloseAt', event.target.value)}
        />
      </div>

      <TextAreaField
        label="Anotações"
        value={value.notes}
        placeholder="O que ficou combinado na última conversa e qual é o próximo passo."
        onChange={(event) => set('notes', event.target.value)}
      />
    </>
  )
}
