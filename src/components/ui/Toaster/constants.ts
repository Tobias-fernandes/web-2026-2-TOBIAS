import { AlertIcon, CheckIcon, InfoIcon } from '@/components/ui/icons'
import type { ToastVariant } from '@/stores/toast'

export const TOAST_VARIANT_ICONS: Record<ToastVariant, typeof CheckIcon> = {
  success: CheckIcon,
  error: AlertIcon,
  info: InfoIcon,
}

export const TOAST_BORDER_CLASSES: Record<ToastVariant, string> = {
  success: 'border-verde-lav',
  error: 'border-vermelho-lav',
  info: 'border-violeta-lav',
}

export const TOAST_ICON_CLASSES: Record<ToastVariant, string> = {
  success: 'bg-verde-lav text-verde',
  error: 'bg-vermelho-lav text-vermelho',
  info: 'bg-violeta-lav text-violeta',
}
