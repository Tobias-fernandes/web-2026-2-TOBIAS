import { useEffect, useRef, type ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * Dialog backed by the native <dialog> element, so focus is trapped inside the
 * form and Escape closes it without extra code.
 */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      aria-label={title}
      className="m-auto w-[min(560px,92vw)] rounded-xl border border-linha bg-papel-alto p-0 text-tinta backdrop:bg-veu"
    >
      <div className="flex items-center justify-between gap-4 border-b border-linha px-6 py-4">
        <h2 className="font-display text-md font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-[3px] px-2 text-xl leading-none text-tinta-suave hover:text-tinta"
        >
          ×
        </button>
      </div>
      <div className="max-h-[70dvh] overflow-y-auto px-6 pt-6 pb-7">{children}</div>
    </dialog>
  )
}
