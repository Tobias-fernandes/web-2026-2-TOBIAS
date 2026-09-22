import type {} from "react";
import { useSheet } from "./hooks";
import { CloseIcon } from "@/components/ui/icons";
import type { SheetProps } from "./types";

/**
 * Panel that slides in over the page from the left edge.
 *
 * Backed by the native `<dialog>`, like `Modal`: Escape closes it, focus is
 * trapped inside and everything behind it goes inert — none of which a `div`
 * with a `hidden` class gives you. That matters more here than in a dialog,
 * because this is the navigation: tabbing out of an open menu into the page
 * underneath is how a phone user gets lost.
 */
const Sheet: React.FC<SheetProps> = ({ open, title, onClose, children }) => {
  const { ref, handleCancel, handleBackdropClick } = useSheet(open, onClose);

  return (
    <dialog
      ref={ref}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-label={title}
      className="gaveta fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(320px,86vw)] max-w-none border-r border-linha bg-papel-alto p-0 text-tinta backdrop:bg-veu"
    >
      <div className="flex h-full flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="absolute top-3.5 right-3 rounded-md p-1.5 text-tinta-suave hover:bg-papel hover:text-tinta"
        >
          <CloseIcon size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
};

export { Sheet };
