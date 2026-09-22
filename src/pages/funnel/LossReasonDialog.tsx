import { Button, Modal, SelectField, labelOptions } from "@/components/ui";
import { LOSS_REASON_LABELS } from "@/domain/constants";
import type { LossReason } from "@/domain/types";
import type { LossReasonDialogProps } from "./types";

const LOSS_OPTIONS = labelOptions(LOSS_REASON_LABELS);

/** Closing a deal as lost asks why, because the reason is the whole value. */
const LossReasonDialog: React.FC<LossReasonDialogProps> = ({
  reason,
  submitting,
  onChange,
  onCancel,
  onConfirm,
}) => {
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
          value={reason ?? "price"}
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
  );
};

export { LossReasonDialog };
