import { CloseIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useDismissToast, useToasts } from '@/stores/toast'
import { TOAST_BORDER_CLASSES, TOAST_ICON_CLASSES, TOAST_VARIANT_ICONS } from './constants'

/**
 * Fire-and-forget feedback for actions that have no other confirmation on
 * screen — a save that closes its dialog, a status flipped from a table row,
 * a sign-out. Mounted once outside the router (`App.tsx`), so it survives a
 * client-side navigation and shows over any screen, not just one route.
 */
export function Toaster() {
  const toasts = useToasts()
  const dismiss = useDismissToast()

  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
    >
      {toasts.map((item) => {
        const Icon = TOAST_VARIANT_ICONS[item.variant]

        return (
          <div
            key={item.id}
            className={cn(
              'toast-entrada flex w-[min(380px,92vw)] items-start gap-3 rounded-lg border bg-papel-alto p-3.5 shadow-[0_8px_24px_rgb(0_0_0/0.14)]',
              TOAST_BORDER_CLASSES[item.variant],
            )}
          >
            <span
              aria-hidden
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full',
                TOAST_ICON_CLASSES[item.variant],
              )}
            >
              <Icon size={15} />
            </span>
            <p className="m-0 flex-1 pt-0.5 text-sm leading-snug text-tinta">
              {item.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Fechar aviso"
              className="shrink-0 rounded-[3px] p-1 text-tinta-suave hover:text-tinta"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
