import type { ReactNode } from "react";

export interface FormDialogProps {
  open: boolean;
  title: string;
  /** Label of the confirm button; it turns into "Salvando…" while submitting. */
  submitLabel: string;
  error: string | null;
  submitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
  children: ReactNode;
}
