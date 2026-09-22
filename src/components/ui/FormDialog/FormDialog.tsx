import type {} from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ErrorText } from "@/components/ui/ListState";
import type { FormDialogProps } from "./types";

/**
 * "New record" dialog: a field set, the failure message and the two buttons.
 *
 * Pairs with `useFormDialog`, which owns the matching state. Together they
 * replace the copy of this markup that each register screen used to carry.
 */
const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  submitLabel,
  error,
  submitting,
  onSubmit,
  onClose,
  children,
}) => {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {children}

        {error && <ErrorText>{error}</ErrorText>}

        <div className="flex justify-end gap-2">
          <Button variant="subtle" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Salvando…" : submitLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { FormDialog };
