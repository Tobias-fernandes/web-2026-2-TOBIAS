import { TextField } from '@/components/ui'
import { formatCnpj } from '@/lib/document'
import type { SignUpFormState } from '../types'

interface StepProps {
  value: SignUpFormState
  onChange: (value: SignUpFormState) => void
}

export function EnterpriseStep({ value, onChange }: StepProps) {
  return (
    <>
      <TextField
        label="Nome fantasia"
        placeholder="AltoTech Juniors"
        value={value.tradeName}
        onChange={(event) => onChange({ ...value, tradeName: event.target.value })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="CNPJ"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          hint="Conferido pelo dígito verificador."
          value={formatCnpj(value.cnpj)}
          onChange={(event) => onChange({ ...value, cnpj: event.target.value })}
        />
        <TextField
          label="E-mail oficial da EJ"
          type="email"
          placeholder="contato@suaej.com.br"
          hint="O endereço da empresa, não o seu."
          value={value.email}
          onChange={(event) => onChange({ ...value, email: event.target.value })}
        />
      </div>
    </>
  )
}
