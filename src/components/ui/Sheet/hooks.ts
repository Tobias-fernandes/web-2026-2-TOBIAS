import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from "react";

/** Same native-dialog syncing as `Modal`, plus closing on a backdrop click. */
const useSheet = (open: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  /** A click on the backdrop lands on the dialog itself, never on a child. */
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) onClose();
  };

  return { ref, handleCancel, handleBackdropClick };
};

export { useSheet };
