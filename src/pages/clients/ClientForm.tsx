import { SelectField, TextAreaField, TextField } from '@/components/ui'
import { CLIENT_STATUS_LABELS } from '@/domain/constants'
import type { ClientStatus } from '@/domain/types'
import type { ClientFormState } from './types'

interface ClientFormProps {
  value: ClientFormState
  onChange: (value: ClientFormState) => void
}

export function ClientForm({ value, onChange }: ClientFormProps) {
  const set = <K extends keyof ClientFormState>(
    key: K,
    fieldValue: ClientFormState[K],
  ) => onChange({ ...value, [key]: fieldValue })

  return (
    <>
      <TextField
        label="Nome ou razão social"
        value={value.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="CNPJ"
          hint="Opcional para leads."
          value={value.taxId}
          onChange={(event) => set('taxId', event.target.value)}
        />
        <TextField
          label="Segmento"
          value={value.segment}
          onChange={(event) => set('segment', event.target.value)}
        />
        <TextField
          label="Pessoa de contato"
          value={value.contactName}
          onChange={(event) => set('contactName', event.target.value)}
        />
        <TextField
          label="Telefone"
          value={value.phone}
          onChange={(event) => set('phone', event.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          value={value.email}
          onChange={(event) => set('email', event.target.value)}
        />
        <SelectField
          label="Situação"
          value={value.status}
          onChange={(event) => set('status', event.target.value as ClientStatus)}
          options={(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map(
            (status) => ({ value: status, label: CLIENT_STATUS_LABELS[status] }),
          )}
        />
      </div>
      <TextAreaField
        label="Observações"
        value={value.notes}
        onChange={(event) => set('notes', event.target.value)}
        placeholder="Como chegou até a EJ, histórico de conversas…"
      />
    </>
  )
}
