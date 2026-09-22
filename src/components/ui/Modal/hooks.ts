import { useEffect, useRef, type SyntheticEvent } from "react";

/**
 * Keeps the native `<dialog>` in sync with the `open` prop.
 *
 * `showModal()`/`close()` are imperative, so the element has to be told what
 * the prop already says — React does not drive the dialog's own open state.
 */
const useModal = (open: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /** Escape fires `cancel` first; letting it through would close without telling React. */
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  return { ref, handleCancel };
};

export { useModal };
