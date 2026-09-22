import { Button, Modal, SelectField, labelOptions } from '@/components/ui'
import { LOSS_REASON_LABELS } from '@/domain/constants'
import type { LossReason } from '@/domain/types'

const LOSS_OPTIONS = labelOptions(LOSS_REASON_LABELS)

interface LossReasonDialogProps {
  reason: LossReason | null
  submitting: boolean
  onChange: (reason: LossReason) => void
  onCancel: () => void
  onConfirm: () => void
}

/** Closing a deal as lost asks why, because the reason is the whole value. */
export function LossReasonDialog({
  reason,
  submitting,
  onChange,
  onCancel,
  onConfirm,
}: LossReasonDialogProps) {
  return (
    <Modal
      open={reason !== null}
      title="Por que a negociação foi perdida?"
      onClose={onCancel}
    >
      <div className="flex flex-col gap-4">
        <SelectField
          label="Motivo"
          hint="Sem o motivo, a diretoria seguinte repete o mesmo erro."
          value={reason ?? 'price'}
          options={LOSS_OPTIONS}
          onChange={(event) => onChange(event.target.value as LossReason)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="subtle" onClick={onCancel}>
            Cancelar
          </Button>
          <Button disabled={submitting} onClick={onConfirm}>
            Marcar como perdida
          </Button>
        </div>
      </div>
    </Modal>
  )
}
