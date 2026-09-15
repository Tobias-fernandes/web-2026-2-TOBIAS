import type { ButtonVariant } from './types'

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: 'bg-violeta text-white hover:bg-violeta-escuro',
  outline: 'border border-tinta text-tinta hover:bg-tinta hover:text-white',
  subtle:
    'border border-linha bg-papel-alto text-tinta-suave hover:text-tinta hover:border-tinta',
  danger:
    'border border-linha bg-papel-alto text-tinta-suave hover:border-ambar hover:text-ambar',
}
